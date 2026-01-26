'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authLinks } from '@/config/links.config';
import { accountAuth } from '../api';
import { AuthStorage } from '../storage';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
    user: any | null;
    status: AuthStatus;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any | null>(null);
    const [status, setStatus] = useState<AuthStatus>('loading');

    // Синхронизируем localStorage с cookies
    const syncWithCookies = () => {
        if (typeof window === 'undefined') return;
        
        const token = AuthStorage.getAccessToken();
        const userData = AuthStorage.getUser();
        
        if (token) {
            // Устанавливаем cookie для middleware
            document.cookie = `auth_access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
            setUser(userData);
            setStatus('authenticated');
        } else {
            // Удаляем cookie
            document.cookie = 'auth_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            setStatus('unauthenticated');
        }
    };

    useEffect(() => {
        syncWithCookies();
    }, []);

    // Логин
    const login = async (email: string, password: string): Promise<boolean> => {
        setStatus('loading');
        try {
            const response = await accountAuth.login({ email, password });
            
            if (response.status && response.data) {
                setUser(response.data.user);
                syncWithCookies(); // Обновляем cookies
                return true;
            } else {
                setStatus('unauthenticated');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            setStatus('unauthenticated');
            return false;
        }
    };

    // Логаут
    const logout = async () => {
        try {
            await accountAuth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            AuthStorage.clear();
            accountAuth.clearToken();
            setUser(null);
            syncWithCookies(); // Очищаем cookies
            router.push(authLinks.login);
        }
    };

    const value = {
        user,
        status,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}