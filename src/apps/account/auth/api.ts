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
                api.setToken(storedToken);
            }
        }
    }

    async tryRestoreAuth(): Promise<boolean> {
        // Проверяем только на клиенте
        if (typeof window === 'undefined') return false;
        
        const refreshToken = AuthStorage.getRefreshToken();
        const accessToken = AuthStorage.getAccessToken();
        const user = AuthStorage.getUser();
        
        // Если есть access token - всё ок (даже если нет пользователя)
        if (accessToken) {
            this.setToken(accessToken);
            return true;
        }
        
        // Если есть только refresh token - пробуем восстановить
        if (refreshToken) {
            console.log('🔄 Нет access токена, пробуем восстановить через refresh...');
            try {
                const refreshResult = await this.refreshTokens();
                
                if (refreshResult?.status) {
                    console.log('✅ Авторизация восстановлена через refresh');
                    return true;
                }
            } catch (error) {
                console.error('❌ Не удалось восстановить авторизацию:', error);
            }
        }
        
        return false;
    }

    setToken(token: string): void {
        this.token = token;
        api.setToken(token);
    }

    clearToken(): void {
        this.token = null;
        api.setToken(null);
        AuthStorage.clear();
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
                        existingUser || response.data.user || {} // Используем существующего пользователя
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

    async getProfile(): Promise<ApiResponse<Account>> {
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

    isAuthenticated(): boolean {
        return !!this.token && AuthStorage.hasToken();
    }

    getCurrentUser(): Account | null {
        return AuthStorage.getUser();
    }
}

export const accountAuth = new AccountAuth();