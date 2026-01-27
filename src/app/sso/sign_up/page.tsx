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
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { 
  containerVariants, 
  itemVariants, 
  errorVariants, 
  buttonVariants,
  formVariants,
  inputErrorVariants 
} from './_animations';

export default function RegisterPage() {
  const router = useRouter();
  const { register, confirmEmail, resendConfirmation, user, status } = useAuth();
  const [step, setStep] = useState<'form' | 'code'>('form'); // Шаги: форма или код
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // Редирект если уже авторизован
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/platform');
    }
  }, [status, router]);
  
  // Таймер для повторной отправки кода
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Очистка ошибки при изменении полей
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [formData, code]);

  // Таймер для сообщений
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Введите имя');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Введите email');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Введите корректный email');
      return false;
    }
    
    if (!formData.password) {
      setError('Введите пароль');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
        const result = await register(
            formData.email,
            formData.password,
            formData.name
        );
        
        if (result.success) {
            setStep('code');
            setSuccessMessage(result.message || `Код подтверждения отправлен на ${formData.email}`);
            setCanResend(false);
            setResendTimer(60);
        } else {
            setError(result.message || 'Не удалось зарегистрироваться. Попробуйте позже.');
        }
    } catch (error: any) {
        console.log('Registration error:', error);
        let errorMessage = 'Ошибка при регистрации';
        
        if (error.message?.includes('email already exists')) {
            errorMessage = 'Этот email уже используется';
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }
        
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
};

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('Введите код подтверждения');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await confirmEmail(code);
      
      if (success) {
        setSuccessMessage('Аккаунт успешно подтвержден!');
        setTimeout(() => {
          router.push('/platform');
        }, 2000);
      } else {
        setError('Неверный код подтверждения');
      }
    } catch (error: any) {
      setError('Ошибка при подтверждении кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await resendConfirmation(formData.email);
      
      if (success) {
        setSuccessMessage('Новый код отправлен на вашу почту');
        setCanResend(false);
        setResendTimer(60);
      } else {
        setError('Не удалось отправить код');
      }
    } catch (error) {
      setError('Ошибка при отправке кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'form') {
        handleSubmit();
      } else {
        handleVerifyCode();
      }
    }
  };

  // Загрузка
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

  // Если уже авторизован
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
        {step === 'form' ? 'Создать аккаунт' : 'Подтверждение почты'}
        </motion.div>
        
        {/* Сообщения об ошибках/успехе */}
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Close className={styles.svg} />
            </motion.button>
            </motion.div>
        )}
        
        {successMessage && (
            <motion.div 
            className={styles.success}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            >
            <span className={styles.capture}>{successMessage}</span>
            </motion.div>
        )}
        </AnimatePresence>
        
        {/* Переключение между формами */}
        <AnimatePresence mode="wait">
        {step === 'form' ? (
            <>
            <motion.div
                key="form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.credentials}
            >
                <motion.section 
                className={styles.section}
                variants={itemVariants}
                >
                <div className={styles.capture}>Имя / псевдоним</div>
                <motion.div whileHover={{ scale: 1.01 }}>
                    <Input 
                    className={styles.input} 
                    variant='default'
                    value={formData.name}
                    onChange={handleChange('name')}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    />
                </motion.div>
                </motion.section>
                
                <motion.section 
                className={styles.section}
                variants={itemVariants}
                >
                <div className={styles.capture}>Почта</div>
                <motion.div whileHover={{ scale: 1.01 }}>
                    <Input 
                    className={styles.input} 
                    variant='default'
                    type='email'
                    value={formData.email}
                    onChange={handleChange('email')}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    />
                </motion.div>
                </motion.section>
                
                <motion.section 
                className={styles.split}
                variants={itemVariants}
                >
                <section className={styles.section}>
                    <div className={styles.capture}>Пароль</div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                    <Input 
                        className={styles.input} 
                        variant='default'
                        type='password'
                        value={formData.password}
                        onChange={handleChange('password')}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    </motion.div>
                </section>
                
                <section className={styles.section}>
                    <div className={styles.capture}>Повторите пароль</div>
                    <motion.div whileHover={{ scale: 1.01 }}>
                    <Input 
                        className={styles.input} 
                        variant='default'
                        type='password'
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    </motion.div>
                </section>
                </motion.section>
            </motion.div>
            
            <motion.div 
                key="form-actions"
                className={styles.actions}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.section className={styles.section}>
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button 
                    className={styles.action} 
                    variant='contrast'
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    >
                    Создать аккаунт
                    </Button>
                </motion.div>
                </motion.section>
                
                <motion.section className={styles.section}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link href={authLinks.login}>
                    <Button 
                        className={styles.action} 
                        variant='glass'
                        disabled={isLoading}
                    >
                        Уже есть аккаунт
                    </Button>
                    </Link>
                </motion.div>
                </motion.section>
            </motion.div>
            </>
        ) : (
            <>
            <motion.div
                key="code"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.credentials}
            >
                <motion.section 
                className={styles.section}
                variants={itemVariants}
                >
                <div className={styles.capture}>
                    Введите код из письма
                </div>
                <motion.div whileHover={{ scale: 1.01 }}>
                    <Input 
                    className={styles.input} 
                    variant='default'
                    placeholder="6-значный код"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    />
                </motion.div>
                <div className={styles.hint}>
                Отправлен на {formData.email}
                </div>
                </motion.section>
            </motion.div>
            
            <motion.div 
                key="code-actions"
                className={styles.actions}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.section className={styles.section}>
                <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    <Button 
                    className={styles.action} 
                    variant='contrast'
                    onClick={handleVerifyCode}
                    loading={isLoading}
                    disabled={isLoading}
                    >
                    Подтвердить
                    </Button>
                </motion.div>
                </motion.section>
                
                <motion.section className={styles.section}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button 
                    className={styles.action} 
                    variant='glass'
                    onClick={handleResendCode}
                    disabled={isLoading || !canResend}
                    >
                    {canResend ? 'Отправить код повторно' : `Повторно через ${resendTimer}с`}
                    </Button>
                </motion.div>
                </motion.section>
                
                <motion.section className={styles.section}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button 
                    className={styles.action} 
                    variant='glass'
                    onClick={() => setStep('form')}
                    disabled={isLoading}
                    >
                    Изменить email
                    </Button>
                </motion.div>
                </motion.section>
            </motion.div>
            </>
        )}
        </AnimatePresence>
    </motion.div>
    );
}