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

export class AccountAuth {
    private token: string | null = null;

    // Базовые эндпоинты
    private endpoints = {
        login: '/account/auth',
        register: '/account/reg',
        logout: '/account/logout',  // --empty
        refresh: '/account/refresh',
        profile: '/account/profile',
        confirm: '/account/confirm',
        resendConfirm: '/account/confirm/resend',
    };

    /**
     * Установка токена для авторизованных запросов
     */
    setToken(token: string): void {
        this.token = token;
    }

    /**
     * Очистка токена
     */
    clearToken(): void {
        this.token = null;
    }

    /**
     * Получение headers для авторизованных запросов
     */
    private getAuthHeaders(): Record<string, string> {
        return this.token ? { 
            'Authorization': `Bearer ${this.token}` 
        } : {};
    }

    /**
     * Авторизация пользователя
     */
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<LoginResponse>(this.endpoints.login, credentials);
        if (response.status && response.data.access_token) {
            this.setToken(response.data.access_token);
        }
        return response;
    }

    /**
     * Регистрация нового пользователя
     */
    async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
        const response = await api.post<RegisterResponse>(this.endpoints.register, data);
        if (response.status && response.data.access_token) {
            this.setToken(response.data.access_token);
        }
        return response;
    }

    /**
     * Подтверждение email
     */
    async confirmEmail(data: ConfirmRequest): Promise<ApiResponse<EmptyResponseData>> {
        return api.post<EmptyResponseData>(this.endpoints.confirm, data, {
            headers: this.getAuthHeaders()
        });
    }

    /**
     * Повторная отправка кода подтверждения
     */
    async resendConfirmation(data: ResendConfirmRequest): Promise<ApiResponse<EmptyResponseData>> {
        return api.post<EmptyResponseData>(this.endpoints.resendConfirm, data, {
            headers: this.getAuthHeaders()
        });
    }

    /**
     * Выход из системы
     */
    async logout(): Promise<ApiResponse<EmptyResponseData>> {
        const response = await api.post<EmptyResponseData>(this.endpoints.logout, {}, {
            headers: this.getAuthHeaders()
        });
        if (response.status) {
            this.clearToken();
        }
        return response;
    }

    /**
     * Обновление токенов
     */
    async refreshTokens(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post<LoginResponse>(
            this.endpoints.refresh, 
            { refresh_token: refreshToken },
            { headers: this.getAuthHeaders() }
        );
        if (response.status && response.data.access_token) {
            this.setToken(response.data.access_token);
        }
        return response;
    }

    /**
     * Получение профиля пользователя
     */
    async getProfile(): Promise<ApiResponse<Account>> {
        return api.get<Account>(this.endpoints.profile, {
            headers: this.getAuthHeaders()
        });
    }
}

// Экспортируем singleton instance
export const accountAuth = new AccountAuth();