'use client';

import { useAuth } from '@/apps/account/auth/context/AuthContext';
import styles from './page.module.scss';
import { getRandomGradient } from '@/assets/utils/avatars';
import Button from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';

export default function Page() {
    const { login, user, status } = useAuth();
    
    if (!user) {
        return (
            <div></div>
        )
    }
    return (
        <div className={styles.head}>
            <div className={styles.avatar}>
                {user.avatar_url ? (
                    <span 
                        className={styles.img} 
                        style={{backgroundImage: `url('${user.avatar_url}')`}} 
                    />
                ) : (
                    <span 
                        className={`${styles.img} ${styles.gradient}`}
                        style={{ 
                            background: getRandomGradient(user)
                        }}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className={styles.info}>
                <div className={styles.name}>{user.name}</div>
                <div className={styles.description}>
                <ModalTooltip
                    content={`${user.email} - на эту почту поступают приглашения.`}
                    side='bottom'
                >
                    <span>{user.email}</span>
                </ModalTooltip>
                </div>
            </div>
            <div className={styles.actions}>
                <Link href='/platform/account/edit'><Button className={styles.action} fullWidth variant='contrast'>Редактировать</Button></Link>
            </div>
        </div>
    )
}