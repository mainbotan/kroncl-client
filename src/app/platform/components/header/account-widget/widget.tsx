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

export interface AccountWidgetProps {
    className?: string;
}

export function AccountWidget({
    className
}: AccountWidgetProps) {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const widgetRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleOverlayClick = (e: React.MouseEvent) => {
        // левая кнопка мыши = 0 или 1 в зависимости от браузера
        // используем e.button для точности
        if (e.button === 0) {
            setIsOpen(prev => !prev);
        }
    };

    const handleSectionClick = () => {
        setIsOpen(false);
    };

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logout();
        router.push('/');
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
        <div 
            ref={widgetRef}
            className={clsx(styles.widget, className)}
        >
            <div 
                className={styles.overlay}
                onMouseDown={handleOverlayClick}
            >
                <div className={styles.avatar} style={{background: userGradient}}>{userInitials}</div>
            </div>
            {isOpen && (
                <div className={styles.control}>
                    <Link 
                        href='/platform/account' 
                        className={styles.section}
                        onClick={handleSectionClick}
                    >
                        <span className={styles.icon}><Account /></span>
                        <span className={styles.capture}>Управление</span>
                    </Link>
                    <Link 
                        href='/platform/settings' 
                        className={styles.section}
                        onClick={handleSectionClick}
                    >
                        <span className={styles.icon}><Settings /></span>
                        <span className={styles.capture}>Настройки</span>
                    </Link>
                    <a 
                        href='/'
                        className={styles.section}
                        onClick={handleLogout}
                    >
                        <span className={styles.icon}><Exit /></span>
                        <span className={styles.capture}>Выйти</span>
                    </a>
                </div>
            )}
        </div>
    );
}