'use client';

import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './header.module.scss';
import Link from 'next/link';
import Button from '@/assets/ui-kit/button/button';
import Menu from '@/assets/ui-kit/icons/menu';
import Close from '@/assets/ui-kit/icons/close';
import { useDocsSidebar } from '../panel/context/context';
import { ThemeSwitcher } from '@/app/(external)/components/footer/switcher/switcher';

export interface DocsHeaderProps {
    className?: string;
}

export function DocsHeader({
    className
}: DocsHeaderProps) {
    const { isOpen, toggle } = useDocsSidebar();

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <Link href='/'><LogoFull color='#fff' className={styles.icon} /></Link>
                <Link href='/docs' className={styles.tag}>Клиентам</Link>
            </div>
            <div className={styles.actions}>
                <ThemeSwitcher className={styles.switcher} />
                <Button variant='contrast' as='link' href='/sso/sign_in' className={styles.action}>Начать бесплатно</Button>
                <div className={styles.burger}>
                    <button className={styles.button} onClick={toggle}>
                        {isOpen ? <Close /> : <Menu />}
                    </button>
                </div>
            </div>
        </header>
    )
}