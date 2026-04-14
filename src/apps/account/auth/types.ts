// v.14.04.2026 [
// - refresh_token
// + expires_at timestamp

import { Account } from "../types";

export interface AuthTokens {
    access_token: string;
}

export interface BaseAuthResponse extends AuthTokens {
    expires_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse extends BaseAuthResponse {
    user: Account;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface RegisterResponse extends BaseAuthResponse {
    email_sent: boolean;
    user_id: string;
}

export interface ConfirmRequest {
    user_id: string;
    code: string;
}

export interface ResendConfirmRequest {
    user_id: string;
    email: string;
}

export interface UpdateProfileRequest {
    name?: string;
    avatar_url?: string;
}

export interface FingerprintLoginRequest {
    key: string;
}

export interface FingerprintLoginResponse extends BaseAuthResponse {
    user: Account;
}

export interface RefreshResponse extends BaseAuthResponse {}