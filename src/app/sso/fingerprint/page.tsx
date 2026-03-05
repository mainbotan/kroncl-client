'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import styles from '../layout.module.scss';
import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import Close from '@/assets/ui-kit/icons/close';
import { buttonVariants, containerVariants, errorVariants, itemVariants } from './_animations';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import Keyhole from '@/assets/ui-kit/icons/keyhole';
import { Warning } from '../components/warning/warning';

export default function FingerprintPage() {
    const router = useRouter();
    const { loginWithKey, user, status } = useAuth();
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Редирект если авторизован
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/platform');
        }
    }, [status, router]);

    // Авто-скрытие ошибки через 5 секунд
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Сброс ошибки при изменении ключа
    useEffect(() => {
        if (error) setError(null);
    }, [key]);

    const handleLogin = async () => {
        // Валидация
        if (!key.trim()) {
            setError('Введите ключ доступа');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const success = await loginWithKey(key);
            
            if (!success) {
                setError('Неверный или отозванный ключ');
            }
        } catch (error: any) {
            let errorMessage = 'Ошибка при входе по ключу';
            
            if (error.message.includes('invalid')) {
                errorMessage = 'Неверный ключ';
            } else if (error.message.includes('revoked')) {
                errorMessage = 'Ключ был отозван';
            } else if (error.message.includes('expired')) {
                errorMessage = 'Срок действия ключа истек';
            } else if (error.message.includes('Network')) {
                errorMessage = 'Проблема с подключением';
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    // Показываем спиннер пока проверяется статус
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
                <Keyhole style={{width: "1em", height: "1em", color: "var(--color-icon-primary)"}}/>
                Вход по ключу
            </motion.div>
            
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        className={styles.error}
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <span className={styles.capture}>{error}</span>
                        <motion.button 
                            className={styles.button} 
                            onClick={() => setError(null)}
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
                    <div className={styles.capture}>Приватный ключ</div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                        <Input 
                            className={styles.input} 
                            variant='default'
                            placeholder=''
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
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
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            Войти
                        </Button>
                    </motion.div>
                </motion.section>
            </div>
        </motion.div>
    );
}