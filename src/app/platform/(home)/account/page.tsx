'use client';

import { useAuth } from '@/apps/account/auth/context/AuthContext';
import styles from './page.module.scss';
import { getRandomGradient } from '@/assets/utils/avatars';
import Button from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Account } from '@/apps/account/types';
import { accountAuth } from '@/apps/account/auth/api';
import Edit from '@/assets/ui-kit/icons/edit';

export default function Page() {
    const [profile, setProfile] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    
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
    
    if (!profile) {
        return (
            <div></div>
        )
    }
    return (
        <div className={styles.head}>
            <div className={styles.avatar}>
                {profile.avatar_url ? (
                    <span 
                        className={styles.img} 
                        style={{backgroundImage: `url('${profile.avatar_url}')`}} 
                    />
                ) : (
                    <span 
                        className={`${styles.img} ${styles.gradient}`}
                        style={{ 
                            background: getRandomGradient(profile)
                        }}
                    >
                        {profile.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.name}>{profile.name}</div>
                <div className={styles.description}>
                <ModalTooltip
                    content={`${profile.email} - на эту почту поступают приглашения.`}
                    side='bottom'
                >
                    <span>{profile.email}</span>
                </ModalTooltip>
                </div>
            </div>
            <div className={styles.actions}>
                <Button 
                    icon={<Edit />} 
                    as='link' 
                    href='/platform/account/edit' 
                    className={styles.action} 
                    fullWidth 
                    variant='light'
                >Редактировать</Button>
            </div>
        </div>
    )
}