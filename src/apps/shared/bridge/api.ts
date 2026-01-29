import { ApiResponse, RequestOptions } from './types';
import { accountAuth } from '@/apps/account/auth/api';

class ApiBridge {
    private baseUrl: string;
    private refreshInProgress = false;
    private refreshPromise: Promise<ApiResponse<any> | null> | null = null;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        if (!this.baseUrl) {
            console.warn('NEXT_PUBLIC_API_URL is not defined');
        }
    }

    /**
     * Установка токена
     */
    setToken(token: string | null): void {
        // Это для прямого управления токеном
    }

    /**
     * Общая логика обработки refresh токена
     */
    private async handleTokenRefresh(): Promise<boolean> {
        if (this.refreshInProgress && this.refreshPromise) {
            await this.refreshPromise;
            return true;
        }

        this.refreshInProgress = true;
        this.refreshPromise = (async () => {
            try {
                console.log('🔄 Автопродление токена...');
                const refreshResult = await accountAuth.refreshTokens();
                return refreshResult;
            } catch (error) {
                console.error('❌ Ошибка при обновлении токена:', error);
                return null;
            } finally {
                this.refreshInProgress = false;
                this.refreshPromise = null;
            }
        })();

        const result = await this.refreshPromise;
        return result?.status === true;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {},
        retryCount = 0
    ): Promise<ApiResponse<T>> {
        const { params, headers, ...fetchOptions } = options;
        const maxRetries = 1; // Максимум одна попытка refresh

        let url = `${this.baseUrl}${endpoint}`;
        
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        // Добавляем токен если есть
        const authToken = localStorage.getItem('auth_access_token');
        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            ...headers,
        };

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers: defaultHeaders,
            });

            const contentType = response.headers.get('content-type');
            const hasJson = contentType && contentType.includes('application/json');

            // Пробуем получить JSON в любом случае
            let jsonResponse: ApiResponse<T> | null = null;
            if (hasJson) {
                try {
                    jsonResponse = await response.json();
                } catch {
                    // Не удалось распарсить JSON
                }
            }

            // Проверяем на 401 ошибку
            if (response.status === 401) {
                // Проверяем, не является ли это эндпоинтом авторизации
                const isAuthEndpoint = endpoint.includes('/account/auth') || 
                                    endpoint.includes('/account/reg') ||
                                    endpoint.includes('/account/refresh');
                
                // Если это не auth endpoint и еще не превышено количество попыток
                if (!isAuthEndpoint && retryCount < maxRetries) {
                    console.log('🔐 Обнаружена 401 ошибка, пробуем refresh...');
                    
                    const refreshSuccess = await this.handleTokenRefresh();
                    
                    if (refreshSuccess) {
                        console.log('🔄 Повторяем запрос после успешного refresh');
                        return this.request<T>(endpoint, options, retryCount + 1);
                    } else {
                        console.log('❌ Refresh не удался, очищаем данные');
                        accountAuth.clearToken();
                        
                        // Редирект на логин если на клиенте
                        if (typeof window !== 'undefined' && window.location.pathname.includes('/platform')) {
                            window.location.href = '/sso/sign_in';
                        }
                    }
                }
                
                // Возвращаем ошибку или бросаем исключение
                if (jsonResponse) {
                    return jsonResponse;
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            // Если ответ не ок и есть JSON - возвращаем его
            if (!response.ok && jsonResponse) {
                return jsonResponse;
            }

            // Если ответ не ок и нет JSON - бросаем ошибку
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Успешный ответ с JSON
            if (jsonResponse) {
                return jsonResponse;
            } else {
                throw new Error('Response is not JSON');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred');
            }
        }
    }

    // crud методы
    get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// singleton instance
export const api = new ApiBridge();