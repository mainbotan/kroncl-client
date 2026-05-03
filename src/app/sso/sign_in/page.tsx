'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../layout.module.scss';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { authLinks } from '@/config/links.config';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import Close from '@/assets/ui-kit/icons/close';
import { buttonVariants, containerVariants, errorVariants, itemVariants } from './_animations';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import Keyhole from '@/assets/ui-kit/icons/keyhole';
import { External } from '../components/external/external';
import { Warning } from '../components/warning/warning';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user, status } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Получаем URL для редиректа после входа
    const redirectTo = searchParams.get('to') || '/platform';

    // Редирект если авторизован
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/sso/redirect?to=' + encodeURIComponent(redirectTo));
        }
    }, [status, router, redirectTo]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [email, password]);

    const handleLogin = async () => {
        if (!email.trim()) {
            setError('Введите email');
            return;
        }
        
        if (!password.trim()) {
            setError('Введите пароль');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Введите корректный email');
            return;
        }

        setError(null);
        setIsLoadingForm(true);

        try {
            const success = await login(email, password);
            
            if (!success) {
                setError('Неверный email или пароль');
            } else {
                router.push('/sso/redirect?to=' + encodeURIComponent(redirectTo));
            }
        } catch (error: any) {
            let errorMessage = 'Произошла ошибка при входе';
            
            if (error.message.includes('invalid credentials')) {
                errorMessage = 'Неверный email или пароль';
            } else if (error.message.includes('401')) {
                errorMessage = 'Неверные учетные данные';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Проблема с подключением к серверу';
            } else {
                errorMessage = error.message || 'Произошла ошибка';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoadingForm(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    // Функция для безопасного редиректа (проверка на внешние URL)
    const getSafeRedirectUrl = (url: string): string => {
        // Проверяем, не является ли URL внешним или опасным
        try {
            const parsedUrl = new URL(url, window.location.origin);
            // Разрешаем только относительные пути и пути того же домена
            if (parsedUrl.origin === window.location.origin) {
                return parsedUrl.pathname + parsedUrl.search;
            }
        } catch {
            // Если URL некорректный, возвращаем /platform
        }
        return '/platform';
    };

    if (status === 'loading') {
        return (
            <div className={styles.frame} style={{
                alignItems: "center", 
                justifyContent: "center",
            }}>
                <Spinner variant='contrast' size='md' />
            </div>
        );
    }

    // Если уже авторизован (будет редирект, но на всякий случай)
    if (status === 'authenticated') {
        return (
            <div className={styles.frame} style={{
                alignItems: "center", 
                justifyContent: "center",
            }}>
                <Spinner variant='contrast' size='md' />
            </div>
        );
    }

    // ТОЛЬКО когда точно знаем, что пользователь не авторизован (status === 'unauthenticated')
    return (
        <motion.div 
            className={styles.frame}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div 
                className={styles.head}
                variants={itemVariants}
            >
                <LogoIco className={styles.logo} />
                Вход в аккаунт
            </motion.div>
            
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        className={styles.error}
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                    >
                        <span className={styles.capture}>{error}</span>
                        <motion.button 
                            className={styles.button} 
                            onClick={() => setError(null)}
                            aria-label="Закрыть сообщение об ошибке"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Close className={styles.svg} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className={styles.credentials}>
                <motion.section 
                    className={styles.section}
                    variants={itemVariants}
                >
                    <div className={styles.capture}>Почта</div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                        <Input 
                            className={styles.input} 
                            variant='default'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoadingForm}
                        />
                    </motion.div>
                </motion.section>
                
                <motion.section 
                    className={styles.section}
                    variants={itemVariants}
                >
                    <div className={styles.capture}>Пароль</div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                        <Input 
                            className={styles.input} 
                            variant='default' 
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoadingForm}
                        />
                    </motion.div>
                    <motion.div
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <Link href='/sso/recovery' className={styles.hint}>
                            Забыли пароль?
                        </Link>
                    </motion.div>
                </motion.section>
            </div>
            <Warning />
            <div className={styles.actions}>
                <motion.section 
                    className={styles.section}
                    variants={itemVariants}
                >
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button 
                            className={styles.action} 
                            variant='contrast'
                            onClick={handleLogin}
                            loading={isLoadingForm}
                            disabled={isLoadingForm}
                        >
                            Войти
                        </Button>
                    </motion.div>
                </motion.section>
                
                <div className={styles.line}>
                    <span className={styles.part} />
                    <span className={styles.word}>или</span>
                    <span className={styles.part} />
                </div>
                
                <motion.section 
                    className={styles.split}
                    variants={itemVariants}
                >
                    <section className={styles.section}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                className={styles.action} 
                                variant='accent'
                                disabled={isLoadingForm}
                                as='link'
                                href={authLinks.registration}
                            >
                                Создать аккаунт
                            </Button>
                        </motion.div>
                    </section>
                    
                    <section className={styles.section}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                className={styles.action} 
                                variant='glass'
                                disabled={isLoadingForm}
                                href='/sso/fingerprint'
                                as='link'
                            >
                                Вход по ключу
                            </Button>
                        </motion.div>
                    </section>
                </motion.section>
            </div>
            {/* <External /> */}
        </motion.div>
    );
}