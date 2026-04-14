export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth_access_token',
    EXPIRES_AT: 'auth_expires_at',
    USER_DATA: 'auth_user_data',
} as const;

export class AuthStorage {
    private static isClient(): boolean {
        return typeof window !== 'undefined';
    }

    static setAuthData(accessToken: string, expiresAt: string, user: any) {
        if (!this.isClient()) return;
        
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt);
        
        if (user) {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
    }

    static getAccessToken(): string | null {
        if (!this.isClient()) return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    static getExpiresAt(): string | null {
        if (!this.isClient()) return null;
        return localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    }

    static getUser(): any | null {
        if (!this.isClient()) return null;
        const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (!data) return null;
        
        try {
            return JSON.parse(data);
        } catch {
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            return null;
        }
    }

    static hasToken(): boolean {
        if (!this.isClient()) return false;
        return !!this.getAccessToken();
    }

    static isTokenExpired(): boolean {
        const expiresAt = this.getExpiresAt();
        if (!expiresAt) return true;
        return new Date(expiresAt) < new Date();
    }

    static clear() {
        if (!this.isClient()) return;
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
}