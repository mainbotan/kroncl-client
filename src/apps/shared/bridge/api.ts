// /apps/shared/bridge/api.ts
import { ApiResponse, RequestOptions } from './types';
import { accountAuth } from '@/apps/account/auth/api';

class ApiBridge {
    private baseUrl: string;

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

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {},
        retryCount = 0
    ): Promise<ApiResponse<T>> {
        const { params, headers, ...fetchOptions } = options;

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

            if (!response.ok) {
                // СНАЧАЛА пробуем получить JSON
                if (hasJson) {
                    try {
                        const errorData = await response.json();
                        // ВАЖНО: Возвращаем JSON как нормальный ответ, даже если status: false
                        // Это НЕ ошибка HTTP, а нормальный ответ от API
                        return errorData as ApiResponse<T>;
                    } catch {
                        // Если не удалось распарсить JSON, тогда бросаем ошибку
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                }
                
                // Если это 401 и НЕ эндпоинт авторизации, пробуем refresh
                // НО ДЛЯ /account/auth не делаем refresh!
                const isAuthEndpoint = endpoint.includes('/account/auth') || 
                                    endpoint.includes('/account/reg');
                
                if (response.status === 401 && retryCount === 0 && !isAuthEndpoint) {
                    const refreshToken = localStorage.getItem('auth_refresh_token');
                    
                    if (refreshToken) {
                        console.log('🔐 Обнаружена 401 ошибка, пробуем refresh...');
                        const refreshResult = await accountAuth.refreshTokens();
                        
                        if (refreshResult?.status) {
                            console.log('🔄 Повторяем запрос после успешного refresh');
                            return this.request<T>(endpoint, options, retryCount + 1);
                        }
                    }
                }
                
                // Если нет JSON или это auth endpoint, бросаем ошибку
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            if (hasJson) {
                const data: ApiResponse<T> = await response.json();
                return data;
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