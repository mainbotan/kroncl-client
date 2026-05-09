'use client';

import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './header.module.scss';
import Link from 'next/link';
import Button from '@/assets/ui-kit/button/button';
import Menu from '@/assets/ui-kit/icons/menu';
import Close from '@/assets/ui-kit/icons/close';
import { ThemeSwitcher } from '@/app/(external)/components/footer/switcher/switcher';
import { useDevSidebar } from '../panel/context/context';

export interface CommunityHeaderProps {
    className?: string;
}

export function CommunityHeader({
    className
}: CommunityHeaderProps) {
    const { isOpen, toggle } = useDevSidebar();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href='/'><LogoFull color='var(--color-text-primary)' className={styles.icon} /></Link>
            </div>
            <div className={styles.actions}>
                <ThemeSwitcher className={styles.switcher} />
                <div className={styles.burger}>
                    <button className={styles.button} onClick={toggle}>
                        {isOpen ? <Close /> : <Menu />}
                    </button>
                </div>
            </div>
        </header>
    )
}