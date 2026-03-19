'use client';

import { useEffect, useState } from 'react';
import styles from './switcher.module.scss';
import Sun from '@/assets/ui-kit/icons/sun';
import clsx from 'clsx';
import Moon from '@/assets/ui-kit/icons/moon';

export interface ThemeSwitcherProps {
    className?: string;
}

export function ThemeSwitcher({
    className
}: ThemeSwitcherProps) {
    
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Инициализация темы при загрузке
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    // Установка светлой темы
    const setLightTheme = () => {
        if (theme !== 'light') {
            setTheme('light');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    };

    // Установка темной темы
    const setDarkTheme = () => {
        if (theme !== 'dark') {
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <div className={clsx(styles.switcher, className)}>
            <span 
                className={clsx(styles.box, theme === 'light' && styles.active)} 
                onClick={setLightTheme}
            >
                <Sun className={styles.svg} />
            </span>
            <span 
                className={clsx(styles.box, theme === 'dark' && styles.active)} 
                onClick={setDarkTheme}
            >
                <Moon className={styles.svg} />
            </span>
        </div>
    )
}