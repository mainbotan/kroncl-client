'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useState, useEffect } from 'react';
import Switch from '@/assets/ui-kit/switch/switch';

export default function Page() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
    }, []);

    const setThemeMode = (newTheme: 'light' | 'dark') => {
        if (theme !== newTheme) {
            setTheme(newTheme);
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
    };

    return (
        <>
            <PlatformHead
                title='Настройки'
                description='Управление окружением, общие настройки платформы.'
            />
            <div className={styles.container}>
                <section className={styles.section}>
                    <div className={styles.capture}>Тема</div>
                    <div className={styles.description}>Берегите свои глаза.</div>
                    <div className={styles.themes}>
                        <button 
                            type="button"
                            className={`${styles.theme} ${theme === 'dark' ? styles.active : ''}`} 
                            onClick={() => setThemeMode('dark')}
                            aria-label="Тёмная тема"
                            data-theme='dark'
                        />
                        <button 
                            type="button"
                            className={`${styles.theme} ${theme === 'light' ? styles.active : ''}`} 
                            onClick={() => setThemeMode('light')}
                            aria-label="Светлая тема"
                            data-theme='light'
                        />
                    </div>
                </section>
            </div>
        </>
    );
}