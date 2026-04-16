'use client';

import { useAuth } from '@/apps/account/auth/context/AuthContext';
import styles from './page.module.scss';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerChildren, boxHover } from './_animations';
import { Account } from '@/apps/account/types';
import { accountAuth } from '@/apps/account/auth/api';
import Edit from '@/assets/ui-kit/icons/edit';
import Exit from '@/assets/ui-kit/icons/exit';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { DOCS_LINK_ACCOUNT } from '@/app/docs/(v1)/internal.config';

export default function Page() {
    const [profile, setProfile] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const { logoutLocal } = useAuth();
    
    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await accountAuth.getProfile();
                
                if (response.status && response.data) {
                    setProfile(response.data);
                } else {
                    console.error('Не удалось загрузить профиль:', response.message);
                }
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        try {
            setIsLoggingOut(true);
            await logoutLocal();
            
            router.push('/');
            
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            
            accountAuth.logoutLocal();
            router.push('/');
        } finally {
            setIsLoggingOut(false);
        }
    };
    
    if (!profile) {
        return (
            <div></div>
        )
    }
    
    return (
        <motion.div 
            className={styles.page} 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
        >
            <PlatformHead
                title='Управление аккаунтом.'
                description='Настройки вашей учётной записи.'
                actions={[
                    {
                        variant: 'accent',
                        children: 'Редактировать',
                        href: '/platform/account/edit',
                        icon: <Edit />
                    }, 
                    {
                        variant: 'empty',
                        children: 'Выйти',
                        icon: <Exit />,
                        as: 'button',
                        onClick: handleLogout,
                        loading: isLoggingOut,
                        disabled: isLoggingOut
                    }
                ]}
                docsEscort={{
                    href: DOCS_LINK_ACCOUNT,
                    title: 'Подробнее о личной учётной записи.'
                }}
            />
            
            <div className={styles.body}>
                <div className={styles.section}>
                    <motion.div 
                        className={styles.map} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={styles.bed}>
                            <div className={styles.grid}>
                                {Array.from({length: 365}, (_, index) => {
                                    const rand = Math.random();
                                    const level = rand < 0.4 ? '' : rand < 0.7 ? 'mn' : rand < 0.9 ? 'md' : 'mx';
                                    const actions = Math.floor(Math.random() * 12) + 1;
                                    const orgs = Math.floor(Math.random() * 4) + 1;
                                    
                                    return (
                                        <motion.div
                                            key={index}
                                            className={clsx(styles.boxWrapper, level && styles[`box_${level}`])}
                                            variants={boxHover}
                                            whileHover="hover"
                                        >
                                            <ModalTooltip 
                                                side='top' 
                                                content={`Активность: ${actions} действий в ${orgs} организациях.`}
                                            >
                                                <motion.span 
                                                    className={clsx(styles.box, level && styles[level])} 
                                                    custom={index}
                                                />
                                            </ModalTooltip>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                        <motion.div 
                            className={styles.legend}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Активность в организациях за последние 365 дней
                            <span className={styles.boxes}>
                                <ModalTooltip side='top' content='Без активности'><span className={clsx(styles.box)} /></ModalTooltip>
                                <ModalTooltip side='top' content='Минимальная активность'><span className={clsx(styles.box, styles.mn)} /></ModalTooltip>
                                <ModalTooltip side='top' content='Средняя активность'><span className={clsx(styles.box, styles.md)} /></ModalTooltip>
                                <ModalTooltip side='top' content='Максимальная активность'><span className={clsx(styles.box, styles.mx)} /></ModalTooltip>
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}