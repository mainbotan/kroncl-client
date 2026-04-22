'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import { getGradientFromString } from '@/assets/utils/avatars';
import Exit from '@/assets/ui-kit/icons/exit';
import Account from '@/assets/ui-kit/icons/account';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Settings from '@/assets/ui-kit/icons/settings';
import Keyhole from '@/assets/ui-kit/icons/keyhole';
import History from '@/assets/ui-kit/icons/history';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export interface AccountWidgetProps {
    className?: string;
}

export function AccountWidget({
    className
}: AccountWidgetProps) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { showMessage } = useMessage();

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.button === 0) {
            setIsOpen(prev => !prev);
        }
    };

    const handleSectionClick = () => {
        setIsOpen(false);
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(false);
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            showMessage({
                label: 'Вы успешно вышли из системы',
                variant: 'success'
            });
            router.push('/');
        } catch (error) {
            showMessage({
                label: 'Не удалось выйти из системы',
                variant: 'error',
                about: error instanceof Error ? error.message : 'Внутренняя ошибка'
            });
        } finally {
            setIsLogoutModalOpen(false);
        }
    };

    const handleLogoutCancel = () => {
        setIsLogoutModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!user) {
        return null;
    }
    
    const userGradient = getGradientFromString(user.name);
    const userInitials = user.name.charAt(0).toUpperCase();

    return (
        <>
            <div 
                ref={widgetRef}
                className={clsx(styles.widget, className)}
            >
                <div 
                    className={styles.overlay}
                    onMouseDown={handleOverlayClick}
                >
                    {user.avatar_url ? (<div className={styles.avatar} style={{backgroundImage: `url(${user.avatar_url})`}} />) :
                    (<div className={styles.avatar} style={{background: userGradient}}>{userInitials}</div>)}
                </div>
                {isOpen && (
                    <div className={styles.control}>
                        <Link 
                            href='/platform/account' 
                            className={styles.section}
                            onClick={handleSectionClick}
                        >
                            <span className={styles.icon}><Account /></span>
                            <span className={styles.capture}>{user.description || 'Управление'}</span>
                        </Link>
                        <Link 
                            href='/platform/settings' 
                            className={styles.section}
                            onClick={handleSectionClick}
                        >
                            <span className={styles.icon}><Settings /></span>
                            <span className={styles.capture}>Настройки</span>
                        </Link>
                        <Link 
                            href='/platform/security' 
                            className={styles.section}
                            onClick={handleSectionClick}
                        >
                            <span className={styles.icon}><Keyhole /></span>
                            <span className={styles.capture}>Безопасность</span>
                        </Link>
                        <a 
                            href='#'
                            className={styles.section}
                            onClick={handleLogoutClick}
                        >
                            <span className={styles.icon}><Exit /></span>
                            <span className={styles.capture}>Выйти</span>
                        </a>
                        <div className={styles.footer}>
                            Управление <span className={styles.accent}>учётной записью</span> Kroncl.
                        </div>
                    </div>
                )}
            </div>

            {/* Modal confirmation for logout */}
            <PlatformModal
                isOpen={isLogoutModalOpen}
                onClose={handleLogoutCancel}
            >
                <PlatformModalConfirmation
                    title='Выйти из системы?'
                    description='Вы уверены, что хотите завершить сеанс работы?'
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: handleLogoutCancel
                        },
                        {
                            variant: 'accent',
                            onClick: handleLogoutConfirm,
                            children: 'Выйти'
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}