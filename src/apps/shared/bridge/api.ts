import { ApiResponse, RequestOptions } from './types';

class ApiBridge {
    private baseUrl: string;
    private refreshInProgress = false;
    private refreshPromise: Promise<ApiResponse<any> | null> | null = null;
    
    // Кэш для дебаунса запросов
    private requestCache = new Map<string, {
        promise: Promise<ApiResponse<any>>;
        timestamp: number;
        data?: any;
    }>();
    private cacheTTL = 1000; // 1 секунда TTL для одинаковых запросов
    
    // Дебаунс таймеры
    private debounceTimers = new Map<string, NodeJS.Timeout>();
    private debounceDelay = 300; // 300ms дебаунс

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
                
                // Получаем refresh токен напрямую из localStorage
                const refreshToken = typeof window !== 'undefined' 
                    ? localStorage.getItem('auth_refresh_token')
                    : null;
                    
                if (!refreshToken) {
                    return null;
                }
                
                // Делаем запрос refresh напрямую
                const response = await this.post<any>('/account/refresh', { 
                    refresh_token: refreshToken 
                });
                
                if (response.status && response.data?.access_token) {
                    // Сохраняем новый токен
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('auth_access_token', response.data.access_token);
                        if (response.data.refresh_token) {
                            localStorage.setItem('auth_refresh_token', response.data.refresh_token);
                        }
                        
                        // Обновляем cookies
                        document.cookie = `auth_access_token=${response.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
                        if (response.data.refresh_token) {
                            document.cookie = `auth_refresh_token=${response.data.refresh_token}; path=/; max-age=2592000; SameSite=Lax`;
                        }
                    }
                    
                    return response;
                } else {
                    // Если refresh не удался, очищаем токены
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_access_token');
                        localStorage.removeItem('auth_refresh_token');
                        // Редирект на логин если на клиенте
                        if (window.location.pathname.includes('/platform')) {
                            window.location.href = '/sso/sign_in';
                        }
                    }
                    return null;
                }
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

    /**
     * Генерация ключа для кэширования запросов
     */
    private generateRequestKey(
        endpoint: string, 
        options: RequestOptions
    ): string {
        const { method = 'GET', params, body } = options;
        
        let key = `${method}:${endpoint}`;
        
        if (params) {
            const sortedParams = Object.keys(params)
                .sort()
                .map(k => `${k}=${params[k]}`)
                .join('&');
            key += `?${sortedParams}`;
        }
        
        // Для POST/PUT/PATCH запросов учитываем тело
        if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            try {
                const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
                // Используем хэш или просто добавляем длину для простоты
                key += `:body=${bodyStr.length}`;
            } catch {
                // Игнорируем ошибки сериализации
            }
        }
        
        return key;
    }

    /**
     * Дебаунс запросов
     */
    private async debouncedRequest<T>(
        endpoint: string,
        options: RequestOptions = {},
        retryCount = 0
    ): Promise<ApiResponse<T>> {
        const requestKey = this.generateRequestKey(endpoint, options);
        
        // Проверяем есть ли такой же активный запрос
        const cached = this.requestCache.get(requestKey);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < this.cacheTTL) {
            console.log(`📦 Используем кэшированный запрос: ${requestKey}`);
            return cached.promise as Promise<ApiResponse<T>>;
        }
        
        // Создаем новый промис для запроса
        const requestPromise = this.makeRequest<T>(endpoint, options, retryCount);
        
        // Сохраняем в кэш
        this.requestCache.set(requestKey, {
            promise: requestPromise,
            timestamp: now
        });
        
        // Очищаем старые записи из кэша
        this.cleanupCache();
        
        return requestPromise;
    }

    /**
     * Очистка старого кэша
     */
    private cleanupCache(): void {
        const now = Date.now();
        for (const [key, value] of this.requestCache.entries()) {
            if (now - value.timestamp > this.cacheTTL * 10) { // 10x TTL
                this.requestCache.delete(key);
            }
        }
    }

    /**
     * Основной метод выполнения запроса
     */
    private async makeRequest<T>(
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
        const authToken = typeof window !== 'undefined' 
            ? localStorage.getItem('auth_access_token')
            : null;
            
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
                        return this.makeRequest<T>(endpoint, options, retryCount + 1);
                    } else {
                        console.log('❌ Refresh не удался, очищаем данные');
                        
                        // Очищаем токены
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('auth_access_token');
                            localStorage.removeItem('auth_refresh_token');
                            localStorage.removeItem('auth_user');
                            
                            // Редирект на логин если на клиенте
                            if (window.location.pathname.includes('/platform')) {
                                window.location.href = '/sso/sign_in';
                            }
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

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {},
        retryCount = 0
    ): Promise<ApiResponse<T>> {
        // Для GET запросов используем дебаунс и кэш
        const method = options.method?.toUpperCase() || 'GET';
        
        if (method === 'GET') {
            return this.debouncedRequest<T>(endpoint, options, retryCount);
        }
        
        // Для остальных методов просто делаем запрос
        return this.makeRequest<T>(endpoint, options, retryCount);
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

    /**
     * Очистка кэша (например, после logout)
     */
    clearCache(): void {
        this.requestCache.clear();
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
    }
}

// singleton instance
export const api = new ApiBridge();