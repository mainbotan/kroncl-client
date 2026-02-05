'use client';

import { useAuth } from '@/apps/account/auth/context/AuthContext';
import styles from './page.module.scss';
import { getRandomGradient } from '@/assets/utils/avatars';
import Button from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerChildren, boxHover } from './_animations'; // <-- Новая анимация
import { Account } from '@/apps/account/types';
import { accountAuth } from '@/apps/account/auth/api';
import Edit from '@/assets/ui-kit/icons/edit';
import Exit from '@/assets/ui-kit/icons/exit';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

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
            <motion.div className={styles.head} variants={staggerChildren}>
                <motion.div className={styles.avatar} variants={staggerChildren}>
                    {profile.avatar_url ? (
                        <motion.span 
                            className={styles.img} 
                            style={{backgroundImage: `url('${profile.avatar_url}')`}}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        />
                    ) : (
                        <motion.span 
                            className={clsx(styles.img, styles.gradient)}
                            style={{ background: getRandomGradient(profile) }}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                        >
                            {profile.name.charAt(0).toUpperCase()}
                        </motion.span>
                    )}
                </motion.div>
                
                <motion.div className={styles.info} variants={staggerChildren}>
                    <motion.div className={styles.name} variants={fadeInUp}>
                        {profile.name}
                    </motion.div>
                    <motion.div className={styles.description} variants={fadeInUp}>
                        <ModalTooltip content={`${profile.email} - на эту почту поступают приглашения.`} side='bottom'>
                            <span>{profile.email}</span>
                        </ModalTooltip>
                    </motion.div>
                </motion.div>
                
                <motion.div className={styles.actions} variants={staggerChildren}>
                    <motion.div className={styles.action} variants={fadeInUp}>
                        <Button 
                            icon={<Edit />} 
                            as='link' 
                            href='/platform/account/edit' 
                            className={styles.action} 
                            fullWidth 
                            variant='light'
                        >
                            Редактировать
                        </Button>
                    </motion.div>
                    <motion.div className={styles.action} variants={fadeInUp}>
                        <ModalTooltip content="Выйти из аккаунта. Действие нельзя отменить." side='left'>
                            <Button 
                                icon={<Exit className={styles.icon} />} 
                                className={styles.action} 
                                fullWidth 
                                onClick={handleLogout}
                                loading={isLoggingOut}
                                disabled={isLoggingOut}
                                variant='default'
                            />
                        </ModalTooltip>
                    </motion.div>
                </motion.div>
            </motion.div>
            
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
                <div className={styles.section}></div>
            </div>
        </motion.div>
    );
}