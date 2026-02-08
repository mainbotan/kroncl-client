'use client';

import clsx from 'clsx';
import styles from './footer.module.scss';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Link from 'next/link';
import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import { useEffect, useState } from 'react';
import Sun from '@/assets/ui-kit/icons/sun';
import Moon from '@/assets/ui-kit/icons/moon';

export function Footer() {
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
        <footer className={styles.container}>
            <div className={styles.focus}>
                <div className={styles.brand}>
                    <div className={styles.logo}><LogoFull /></div>
                    
                    <div className={styles.switcher}>
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
                </div>
                <div className={styles.sections}>
                    <div className={styles.group}>
                        <div className={styles.name}>Продукт</div>
                        <Link href='/' className={styles.section}>Управление сделками</Link>
                        <Link href='/' className={styles.section}>CRM</Link>
                        <Link href='/' className={styles.section}>Сотрудники & Команда</Link>
                        <Link href='/' className={styles.section}>Отчёты и аналитика</Link>
                        <Link href='/' className={styles.section}>Управление инвентарём</Link>
                        <Link href='/' className={styles.section}>Складской учёт</Link>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.name}>Предпринимателям</div>
                        <Link href='/' className={styles.section}>Тарифы</Link>
                        <Link href='/' className={styles.section}>Руководство внедрения</Link>
                        <Link href='/' className={styles.section}>Подготовка команды</Link>
                        <Link href='/' className={styles.section}>ИП</Link>
                        <Link href='/' className={styles.section}>ООО</Link>
                        <Link href='/' className={styles.section}>Физическим лицам</Link>
                        <Link href='/' className={styles.section}>Изменение тарифа</Link>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.name}>Командам</div>
                        <section className={styles.section}>Вход в организацию</section>
                        <section className={styles.section}>Руководство менеджера</section>
                        <section className={styles.section}>Выход из организации</section>
                        <section className={styles.section}>Инструменты</section>
                        <section className={styles.section}>Роли</section>
                        <section className={styles.section}>Разрешения</section>
                        <section className={styles.section}>Системным администраторам</section>
                        <section className={styles.section}>Управление аккаунтом</section>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.name}>Разработчикам</div>
                        <section className={styles.section}>Доступ к организации</section>
                        <section className={styles.section}>Документация модулей</section>
                        <section className={styles.section}>DEV-портал</section>
                        <section className={styles.section}>Лимиты API</section>
                        <section className={styles.section}>Стать частью</section>
                        <section className={styles.section}>Создание расширений</section>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.name}>Разработчикам</div>
                        <section className={styles.section}>Доступ к организации</section>
                        <section className={styles.section}>Документация модулей</section>
                        <section className={styles.section}>DEV-портал</section>
                        <section className={styles.section}>Лимиты API</section>
                        <section className={styles.section}>Стать частью</section>
                        <section className={styles.section}>Создание расширений</section>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.name}>Разработчикам</div>
                        <section className={styles.section}>Доступ к организации</section>
                        <section className={styles.section}>Документация модулей</section>
                        <section className={styles.section}>DEV-портал</section>
                        <section className={styles.section}>Лимиты API</section>
                        <section className={styles.section}>Стать частью</section>
                        <section className={styles.section}>Создание расширений</section>
                    </div>
                </div>
            </div>
        </footer>
    )
}