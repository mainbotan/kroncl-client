import { api } from '@/apps/shared/bridge/api';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ConfirmRequest,
    ResendConfirmRequest
} from './types';
import { ApiResponse, EmptyResponseData } from '@/apps/shared/bridge/types';
import { Account } from '../types';
import { AuthStorage } from './storage';

export class AccountAuth {
    private token: string | null = null;
    private isRefreshing = false;
    private refreshPromise: Promise<ApiResponse<LoginResponse> | null> | null = null;

    private endpoints = {
        login: '/account/auth',
        register: '/account/reg',
        logout: '/account/logout',
        refresh: '/account/refresh',
        profile: '/account',
        confirm: '/account/confirm',
        resendConfirm: '/account/confirm/resend',
    };

    constructor() {
        if (typeof window !== 'undefined') {
            const storedToken = AuthStorage.getAccessToken();
            if (storedToken) {
                this.token = storedToken;
                // Убрал вызов api.setToken(storedToken) - вызывает циклическую зависимость
            }
        }
    }

    async tryRestoreAuth(): Promise<boolean> {
        // Проверяем только на клиенте
        if (typeof window === 'undefined') return false;
        
        const refreshToken = AuthStorage.getRefreshToken();
        const accessToken = AuthStorage.getAccessToken();
        
        // Если есть access token - проверяем его валидность
        if (accessToken) {
            try {
                // Проверяем JWT exp
                const parts = accessToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    const exp = payload.exp * 1000;
                    const now = Date.now();
                    
                    // Если токен истек больше чем 5 минут назад
                    if (exp < now - (5 * 60 * 1000)) {
                        console.log('🔄 Access токен истек, пробуем refresh...');
                        if (refreshToken) {
                            const refreshResult = await this.refreshTokens();
                            return refreshResult?.status === true;
                        }
                        return false;
                    }
                    
                    // Токен валиден
                    this.setToken(accessToken);
                    return true;
                }
            } catch (error) {
                console.error('❌ Ошибка проверки токена:', error);
            }
        }
        
        // Если есть только refresh token - пробуем восстановить
        if (refreshToken) {
            console.log('🔄 Нет access токена, пробуем восстановить через refresh...');
            try {
                const refreshResult = await this.refreshTokens();
                return refreshResult?.status === true;
            } catch (error) {
                console.error('❌ Не удалось восстановить авторизацию:', error);
            }
        }
        
        return false;
    }

    setToken(token: string): void {
        this.token = token;
        api.setToken(token); // Теперь это безопасно
    }

    clearToken(): void {
        this.token = null;
        api.setToken(null);
        AuthStorage.clear();
        api.clearCache(); // Очищаем кэш при logout
    }

    private getAuthHeaders(): Record<string, string> {
        return this.token ? { 
            'Authorization': `Bearer ${this.token}` 
        } : {};
    }

    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<LoginResponse>(this.endpoints.login, credentials);
        
        if (response.status && response.data.access_token) {
            // Сохраняем в localStorage
            AuthStorage.setAuthData(
                {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                },
                response.data.user
            );
            
            // Устанавливаем токен
            this.setToken(response.data.access_token);
            
            // Устанавливаем cookie для middleware
            if (typeof window !== 'undefined') {
                document.cookie = `auth_access_token=${response.data.access_token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
                document.cookie = `auth_refresh_token=${response.data.refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
            }
        }
        
        return response;
    }

    async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        const response = await api.post<RegisterResponse>(this.endpoints.register, data);
        
        if (response.status && response.data.access_token) {
            // Для регистрации создаем временного пользователя
            const tempUser: Account = {
                id: response.data.user_id,
                email: data.email,
                name: data.name,
                avatar_url: null,
                auth_type: 'password',
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            
            AuthStorage.setAuthData(
                {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                },
                tempUser
            );
            
            this.setToken(response.data.access_token);
        }
        
        return response;
    }

    async confirmEmail(data: ConfirmRequest): Promise<ApiResponse<EmptyResponseData>> {
        return api.post<EmptyResponseData>(this.endpoints.confirm, data, {
            headers: this.getAuthHeaders()
        });
    }

    async resendConfirmation(data: ResendConfirmRequest): Promise<ApiResponse<EmptyResponseData>> {
        return api.post<EmptyResponseData>(this.endpoints.resendConfirm, data, {
            headers: this.getAuthHeaders()
        });
    }

    async logout(): Promise<ApiResponse<EmptyResponseData>> {
        try {
            const response = await api.post<EmptyResponseData>(
                this.endpoints.logout, 
                {}, 
                { headers: this.getAuthHeaders() }
            );
            return response;
        } finally {
            this.clearToken();
        }
    }

    async refreshTokens(): Promise<ApiResponse<LoginResponse> | null> {
        // Если уже в процессе refresh, возвращаем существующий promise
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        const refreshToken = AuthStorage.getRefreshToken();
        if (!refreshToken) {
            this.clearToken();
            return null;
        }

        this.isRefreshing = true;
        this.refreshPromise = (async () => {
            try {
                console.log('🔄 Обновляем токен...');
                
                const response = await api.post<LoginResponse>(
                    this.endpoints.refresh, 
                    { refresh_token: refreshToken }
                );
                
                if (response.status && response.data.access_token) {
                    // Получаем существующего пользователя
                    const existingUser = AuthStorage.getUser();
                    
                    // Сохраняем новые токены со старыми данными пользователя
                    AuthStorage.setAuthData(
                        {
                            access_token: response.data.access_token,
                            refresh_token: response.data.refresh_token,
                        },
                        existingUser || response.data.user || {}
                    );
                    
                    this.setToken(response.data.access_token);
                    console.log('✅ Токен успешно обновлен');
                    return response;
                } else {
                    this.clearToken();
                    return null;
                }
            } catch (error) {
                console.error('❌ Ошибка при обновлении токена:', error);
                this.clearToken();
                return null;
            } finally {
                this.isRefreshing = false;
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    async getProfile(forceRefresh = false): Promise<ApiResponse<Account>> {
        // Проверяем, есть ли данные в localStorage
        const cachedUser = AuthStorage.getUser();
        
        // Если forceRefresh = false и есть кэшированный пользователь,
        // возвращаем его сразу, но все равно делаем фоновый запрос для обновления
        if (!forceRefresh && cachedUser) {
            // Делаем фоновый запрос для обновления данных
            this.updateProfileInBackground();
            
            // Возвращаем кэшированные данные
            return {
                status: true,
                message: 'OK (cached)',
                data: cachedUser,
                _meta: {
                    timestamp: new Date().toISOString(),
                    request_id: `cached-${Date.now()}`,
                    path: this.endpoints.profile,
                    method: 'GET'
                }
            };
        }
        
        // Делаем запрос к API
        const response = await api.get<Account>(this.endpoints.profile, {
            headers: this.getAuthHeaders()
        });
        
        if (response.status && response.data) {
            const currentUser = AuthStorage.getUser();
            if (currentUser) {
                const updatedUser = { ...currentUser, ...response.data };
                const tokens = {
                    access_token: AuthStorage.getAccessToken() || '',
                    refresh_token: AuthStorage.getRefreshToken() || '',
                };
                
                AuthStorage.setAuthData(tokens, updatedUser);
            }
        }
        
        return response;
    }

    /**
     * Фоновое обновление профиля без блокировки UI
     */
    private async updateProfileInBackground(): Promise<void> {
        // Проверяем, когда последний раз обновляли профиль
        const lastUpdate = localStorage.getItem('profile_last_update');
        const now = Date.now();
        
        // Обновляем не чаще чем раз в 30 секунд
        if (!lastUpdate || (now - parseInt(lastUpdate)) > 30 * 1000) {
            try {
                console.log('🔄 Фоновое обновление профиля...');
                const response = await api.get<Account>(this.endpoints.profile, {
                    headers: this.getAuthHeaders()
                });
                
                if (response.status && response.data) {
                    const currentUser = AuthStorage.getUser();
                    if (currentUser) {
                        const updatedUser = { ...currentUser, ...response.data };
                        const tokens = {
                            access_token: AuthStorage.getAccessToken() || '',
                            refresh_token: AuthStorage.getRefreshToken() || '',
                        };
                        
                        AuthStorage.setAuthData(tokens, updatedUser);
                        localStorage.setItem('profile_last_update', now.toString());
                        console.log('✅ Профиль обновлен в фоне');
                    }
                }
            } catch (error) {
                console.error('❌ Ошибка фонового обновления профиля:', error);
            }
        }
    }

    isAuthenticated(): boolean {
        return !!this.token && AuthStorage.hasToken();
    }

    getCurrentUser(): Account | null {
        return AuthStorage.getUser();
    }

    /**
     * Инвалидация кэша профиля
     */
    invalidateProfileCache(): void {
        localStorage.removeItem('profile_last_update');
        // ApiBridge сам обработает кэш через свой механизм
    }
}

export const accountAuth = new AccountAuth();