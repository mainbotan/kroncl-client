export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth_access_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER_DATA: 'auth_user_data',
} as const;

export class AuthStorage {
    private static isClient(): boolean {
        return typeof window !== 'undefined';
    }

    static setAuthData(tokens: { access_token: string; refresh_token: string }, user: any) {
        if (!this.isClient()) return;
        
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
        
        // Проверяем, что user не undefined/null
        if (user) {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        } else {
            // Если user undefined/null, удаляем ключ
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
    }

    static getAccessToken(): string | null {
        if (!this.isClient()) return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }

    static getRefreshToken(): string | null {
        if (!this.isClient()) return null;
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    static getUser(): any | null {
        if (!this.isClient()) return null;
        const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (!data) return null;
        
        try {
            const parsed = JSON.parse(data);
            return parsed;
        } catch (error) {
            console.error('❌ Ошибка парсинга user data из localStorage:', error);
            console.log('📦 Сырые данные:', data);
            
            // Удаляем некорректные данные
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            return null;
        }
    }

    static hasToken(): boolean {
        if (!this.isClient()) return false;
        return !!this.getAccessToken();
    }

    static clear() {
        if (!this.isClient()) return;
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    /**
     * Очистка некорректных данных
     */
    static cleanup() {
        if (!this.isClient()) return;
        
        const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        // Если данные есть, но это строка "undefined" или "null"
        if (data === 'undefined' || data === 'null' || data === '') {
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            console.log('🧹 Очищены некорректные данные пользователя');
        }
    }
}