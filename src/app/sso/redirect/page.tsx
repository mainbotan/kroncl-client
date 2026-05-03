'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import styles from '../layout.module.scss';
import { containerVariants, itemVariants } from './_animations';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import Button from '@/assets/ui-kit/button/button';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export default function AuthRedirectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, status } = useAuth();
    const [showChoice, setShowChoice] = useState(false);
    
    const redirectTo = searchParams.get('to') || '/platform';

    useEffect(() => {
        if (status === 'loading') return;
        
        if (status === 'unauthenticated') {
            router.push('/sso/sign_in');
            return;
        }
        
        if (status === 'authenticated' && user) {
            if (user.is_admin && user.admin_level && user.admin_level >= 1) {
                setShowChoice(true);
            } else {
                router.push(redirectTo);
            }
        }
    }, [status, user, router, redirectTo]);

    const handleAdminRedirect = () => {
        router.push('/tech');
    };

    const handlePlatformRedirect = () => {
        router.push(redirectTo);
    };

    if (status === 'loading' || (status === 'authenticated' && !showChoice && !user?.is_admin)) {
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
                Куда идём?
            </motion.div>
            
            <motion.div 
                className={styles.divorce}
                variants={itemVariants}
            >
                <Button 
                    className={styles.action} 
                    variant='contrast'
                    onClick={handleAdminRedirect}
                >
                    Разработчикам & Админам
                </Button>
                <Button 
                    className={styles.action} 
                    variant='accent'
                    onClick={handlePlatformRedirect}
                >
                    Платформа
                </Button>
                <div className={styles.about}>
                    Вы видите эту страницу, потому что были назначены техническим администратором
                </div>
            </motion.div>
        </motion.div>
    );
}