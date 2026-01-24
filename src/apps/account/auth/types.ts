import { Account } from "../types";

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: Account;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface RegisterResponse {
    access_token: string;
    refresh_token: string;
    email_sent: boolean;
    user_id: string;
}

export interface ConfirmRequest {
    token: string;
}

export interface ResendConfirmRequest {
    email: string;
}