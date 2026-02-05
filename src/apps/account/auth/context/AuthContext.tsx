'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authLinks } from '@/config/links.config';
import { accountAuth } from '../api';
import { AuthStorage } from '../storage';
import { Account } from '../../types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
    user: Account | null;
    status: AuthStatus;
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, name: string) => Promise<{success: boolean, message?: string}>;
    confirmEmail: (token: string) => Promise<boolean>;
    resendConfirmation: (email: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<Account | null>(null);
    const [status, setStatus] = useState<AuthStatus>('loading');

    // Восстановление авторизации при загрузке
    useEffect(() => {
        const initAuth = async () => {
            try {
                const restored = await accountAuth.tryRestoreAuth();
                const userData = AuthStorage.getUser();
                
                if (restored && userData) {
                    setUser(userData);
                    
                    // Если пользователь не подтвержден - считаем unauthenticated
                    if (userData.status === 'pending') {
                        setStatus('unauthenticated');
                    } else {
                        setStatus('authenticated');
                        
                        // Запрашиваем профиль ТОЛЬКО если данные устарели
                        // Проверяем, когда последний раз обновлялся профиль
                        const lastProfileUpdate = localStorage.getItem('last_profile_update');
                        const now = Date.now();
                        
                        // Обновляем профиль раз в 5 минут или если его нет
                        if (!lastProfileUpdate || (now - parseInt(lastProfileUpdate)) > 5 * 60 * 1000) {
                            console.log('🔄 Запрашиваем свежий профиль...');
                            const profileResponse = await accountAuth.getProfile();
                            if (profileResponse.status && profileResponse.data) {
                                setUser(profileResponse.data);
                                localStorage.setItem('last_profile_update', now.toString());
                            }
                        }
                    }
                    
                    syncWithCookies();
                } else {
                    setStatus('unauthenticated');
                }
            } catch (error) {
                console.error('Auth init error:', error);
                setStatus('unauthenticated');
            }
        };

        initAuth();
    }, []);
    
    useEffect(() => {
        if (status === 'authenticated') {
            // Проверяем токен каждые 5 минут
            const interval = setInterval(async () => {
                const token = AuthStorage.getAccessToken();
                if (token) {
                    try {
                        // Простая проверка exp из JWT
                        const parts = token.split('.');
                        if (parts.length === 3) {
                            const payload = JSON.parse(atob(parts[1]));
                            const exp = payload.exp * 1000;
                            const now = Date.now();
                            const timeLeft = exp - now;
                            
                            // Если осталось меньше 10 минут, обновляем
                            if (timeLeft < 10 * 60 * 1000) {
                                console.log('🔄 Профилактическое обновление токена...');
                                await accountAuth.refreshTokens();
                            }
                        }
                    } catch (error) {
                        console.error('Token check error:', error);
                    }
                }
            }, 5 * 60 * 1000); // 5 минут
            
            return () => clearInterval(interval);
        }
    }, [status]);
    
    // Синхронизируем localStorage с cookies
    const syncWithCookies = () => {
        if (typeof window === 'undefined') return;
        
        const token = AuthStorage.getAccessToken();
        const userData = AuthStorage.getUser();
        
        if (token && userData) {
            // Устанавливаем cookie для middleware
            document.cookie = `auth_access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
            const refreshToken = AuthStorage.getRefreshToken();
            if (refreshToken) {
                document.cookie = `auth_refresh_token=${refreshToken}; path=/; max-age=2592000; SameSite=Lax`;
            }
        } else {
            // Удаляем cookies
            document.cookie = 'auth_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'auth_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    };

    // Логин
    const login = async (email: string, password: string): Promise<boolean> => {
        setStatus('loading');
        try {
            const response = await accountAuth.login({ email, password });
            
            if (response.status && response.data) {
                setUser(response.data.user);
                syncWithCookies();
                
                // Проверяем статус пользователя
                if (response.data.user.status === 'pending') {
                    // Пользователь не подтвержден
                    setStatus('unauthenticated');
                    return false; // Не даем войти
                } else {
                    setStatus('authenticated');
                    return true;
                }
            } else {
                setStatus('unauthenticated');
                return false;
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setStatus('unauthenticated');
            return false;
        }
    };

    // Регистрация
    const register = async (email: string, password: string, name: string): Promise<{success: boolean, message?: string}> => {
        setStatus('loading');
        
        // Убираем try-catch, так как api.post не выбрасывает исключение
        const response = await accountAuth.register({ email, password, name });
        
        console.log('Register API response:', response); // Для дебага
        
        if (response.status && response.data) {
            // Успешная регистрация
            const userData = AuthStorage.getUser();
            if (userData) {
                setUser(userData);
                syncWithCookies();
            }
            
            // После регистрации пользователь НЕ аутентифицирован
            setStatus('unauthenticated');
            
            return {
                success: true,
                message: response.data.email_sent 
                    ? 'Код подтверждения отправлен на вашу почту' 
                    : 'Регистрация успешна. Проверьте почту для подтверждения'
            };
        } else {
            // Ошибка от сервера
            setStatus('unauthenticated');
            
            // Вот здесь ошибка "email already exists" приходит в response.message
            let errorMessage = response.message || 'Ошибка при регистрации';
            
            console.log('Server error message:', errorMessage); // Для дебага
            
            // Перевод ошибок с английского на русский
            const errorTranslations: Record<string, string> = {
                'email already exists': 'Этот email уже используется',
                'invalid email': 'Неверный формат email',
                'invalid password': 'Пароль не соответствует требованиям',
                'password too weak': 'Пароль слишком лёгкий',
                'name is required': 'Введите имя',
                'email is required': 'Введите email',
                'password is required': 'Введите пароль'
            };
            
            // Если ошибка есть в нашем словаре, переводим
            if (errorMessage in errorTranslations) {
                errorMessage = errorTranslations[errorMessage];
            }
            
            return {
                success: false,
                message: errorMessage
            };
        }
    };

    // Подтверждение email
    const confirmEmail = async (code: string): Promise<boolean> => {
        try {
            const userData = AuthStorage.getUser();
            if (!userData?.id) {
                console.error('No user ID found for confirmation');
                return false;
            }
            
            const response = await accountAuth.confirmEmail({ 
                user_id: userData.id, 
                code 
            });
            
            if (response.status) {
                // После подтверждения обновляем профиль
                const profileResponse = await accountAuth.getProfile();
                if (profileResponse.status && profileResponse.data) {
                    setUser(profileResponse.data);
                    syncWithCookies();
                    setStatus('authenticated');
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Confirm email error:', error);
            return false;
        }
    };

    // Повторная отправка кода подтверждения
    const resendConfirmation = async (email: string): Promise<boolean> => {
        try {
            const userData = AuthStorage.getUser();
            if (!userData?.id) {
                console.error('No user ID found for resend confirmation');
                return false;
            }
            
            const response = await accountAuth.resendConfirmation({ 
                user_id: userData.id,
                email 
            });
            return response.status === true;
        } catch (error) {
            console.error('Resend confirmation error:', error);
            return false;
        }
    };

    const logout = async (localOnly = false) => {
        try {
            if (!localOnly) {
                await accountAuth.logout();
            } else {
                accountAuth.logoutLocal();
            }
        } catch (error) {
            console.error('Logout error:', error);
            accountAuth.logoutLocal();
        } finally {
            AuthStorage.clear();
            accountAuth.clearToken();
            setUser(null);
            setStatus('unauthenticated');
            syncWithCookies();
            router.push(authLinks.login);
        }
    };

    const value = {
        user,
        status,
        login,
        register,
        confirmEmail,
        resendConfirmation,
        logout: () => logout(false),
        logoutLocal: () => logout(true),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}