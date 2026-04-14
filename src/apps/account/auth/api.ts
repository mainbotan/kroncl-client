import { api } from '@/apps/shared/bridge/api';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ConfirmRequest,
    ResendConfirmRequest,
    UpdateProfileRequest,
    RefreshResponse,
    FingerprintLoginResponse,
} from './types';
import { ApiResponse, EmptyResponseData } from '@/apps/shared/bridge/types';
import { Account } from '../types';
import { AuthStorage } from './storage';

export class AccountAuth {
    private token: string | null = null;
    private isRefreshing = false;
    private refreshPromise: Promise<ApiResponse<RefreshResponse> | null> | null = null;

    private endpoints = {
        login: '/account/auth',
        register: '/account/reg',
        logout: '/account/logout',
        refresh: '/account/refresh',
        profile: '/account',
        confirm: '/account/confirm',
        resendConfirm: '/account/confirm/resend',
        updateProfile: '/account',
        fingerprintLogin: '/account/fingerprints/auth',
    };

    constructor() {
        if (typeof window !== 'undefined') {
            const storedToken = AuthStorage.getAccessToken();
            if (storedToken) {
                this.token = storedToken;
            }
        }
    }

    async tryRestoreAuth(): Promise<boolean> {
        if (typeof window === 'undefined') return false;
        
        const accessToken = AuthStorage.getAccessToken();
        
        if (accessToken && !AuthStorage.isTokenExpired()) {
            this.setToken(accessToken);
            return true;
        }
        
        if (accessToken && AuthStorage.isTokenExpired()) {
            const refreshResult = await this.refreshTokens();
            return refreshResult?.status === true;
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
        api.clearCache();
    }

    private getAuthHeaders(): Record<string, string> {
        return this.token ? { 
            'Authorization': `Bearer ${this.token}` 
        } : {};
    }

    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<LoginResponse>(this.endpoints.login, credentials);
        
        if (response.status && response.data) {
            AuthStorage.setAuthData(
                response.data.access_token,
                response.data.expires_at,
                response.data.user
            );
            this.setToken(response.data.access_token);
        }
        
        return response;
    }

    async loginWithKey(key: string): Promise<ApiResponse<FingerprintLoginResponse>> {
        const response = await api.post<FingerprintLoginResponse>(
            this.endpoints.fingerprintLogin, 
            { key }
        );
        
        if (response.status && response.data) {
            AuthStorage.setAuthData(
                response.data.access_token,
                response.data.expires_at,
                response.data.user
            );
            this.setToken(response.data.access_token);
        }
        
        return response;
    }

    async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        const response = await api.post<RegisterResponse>(this.endpoints.register, data);
        
        if (response.status && response.data) {
            const tempUser: Account = {
                id: response.data.user_id,
                email: data.email,
                name: data.name,
                avatar_url: null,
                auth_type: 'password',
                status: 'waiting',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            
            AuthStorage.setAuthData(
                response.data.access_token,
                response.data.expires_at,
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

    async refreshTokens(): Promise<ApiResponse<RefreshResponse> | null> {
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = (async () => {
            try {
                const response = await api.post<RefreshResponse>(
                    this.endpoints.refresh,
                    {},
                    { credentials: 'include' }
                );
                
                if (response.status && response.data) {
                    const existingUser = AuthStorage.getUser();
                    
                    AuthStorage.setAuthData(
                        response.data.access_token,
                        response.data.expires_at,
                        existingUser
                    );
                    
                    this.setToken(response.data.access_token);
                    return response;
                } else {
                    this.clearToken();
                    return null;
                }
            } catch {
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
        return api.get<Account>(this.endpoints.profile, {
            headers: this.getAuthHeaders()
        });
    }

    async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<Account>> {
        const response = await api.patch<Account>(this.endpoints.updateProfile, data, {
            headers: this.getAuthHeaders()
        });
        
        if (response.status && response.data) {
            const currentUser = AuthStorage.getUser();
            if (currentUser) {
                AuthStorage.setAuthData(
                    AuthStorage.getAccessToken()!,
                    AuthStorage.getExpiresAt()!,
                    { ...currentUser, ...response.data }
                );
            }
        }
        
        return response;
    }

    logoutLocal(): void {
        this.clearToken();
    }

    isAuthenticated(): boolean {
        return !!this.token && !AuthStorage.isTokenExpired();
    }

    getCurrentUser(): Account | null {
        return AuthStorage.getUser();
    }
}

export const accountAuth = new AccountAuth();