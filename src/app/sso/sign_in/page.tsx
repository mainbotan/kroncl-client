'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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

export default function LoginPage() {
    const router = useRouter();
    const { login, user, status } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Редирект если авторизован
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/platform');
        }
    }, [status, router]);

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
                
                <motion.section 
                    className={styles.section}
                    variants={itemVariants}
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button 
                            className={styles.action} 
                            variant='glass'
                            disabled={isLoadingForm}
                        >
                            Войти по ключу
                        </Button>
                    </motion.div>
                </motion.section>
                
                <motion.section 
                    className={styles.split}
                    variants={itemVariants}
                >
                    <section className={styles.section}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href={authLinks.registration}>
                                <Button 
                                    className={styles.action} 
                                    variant='accent'
                                    disabled={isLoadingForm}
                                >
                                    Создать аккаунт
                                </Button>
                            </Link>
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
                            >
                                Приглашение
                            </Button>
                        </motion.div>
                    </section>
                </motion.section>
            </div>
        </motion.div>
    );
}