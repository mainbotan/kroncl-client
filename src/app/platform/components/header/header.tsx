'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './header.module.scss';
import OutLink from '@/assets/ui-kit/icons/out-link';
import Button from '@/assets/ui-kit/button/button';
import Menu from '@/assets/ui-kit/icons/menu';
import Close from '@/assets/ui-kit/icons/close';
import clsx from 'clsx';
import { isSectionActive } from '@/assets/utils/sections';
import { useState, useEffect } from 'react';
import { authLinks } from '@/config/links.config';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Sun from '@/assets/ui-kit/icons/sun';
import Moon from '@/assets/ui-kit/icons/moon';
import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import Input from '@/assets/ui-kit/input/input';
import { getRandomGradient } from '@/assets/utils/avatars';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import Bell from '@/assets/ui-kit/icons/bell';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';
import { PllatformSearch } from '../search/search';

export function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const { login, user, status } = useAuth();

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // const renderNavigationItem = (item: typeof navigationConfig[0]) => {
    //     const isActive = isSectionActive(pathname, item);
        
    //     if (item.out) {
    //         return (
    //             <a 
    //                 href={item.href}
    //                 target="_blank"
    //                 key={item.href}
    //                 rel="noopener noreferrer"
    //                 className={clsx(styles.section, isActive && styles.active)}
    //             >
    //                 <span className={styles.name}>{item.name}</span>
    //                 <span className={styles.icon}><OutLink className={styles.svg} /></span>
    //             </a>
    //         );
    //     }

    //     return (
    //         <Link 
    //             href={item.href}
    //             key={item.href}
    //             className={clsx(styles.section, isActive && styles.active)}
    //         >
    //             <span className={styles.name}>{item.name}</span>
    //         </Link>
    //     );
    // };

    return (
        <>
            <header className={clsx(styles.container, isMenuOpen && styles.active)}>
                <Link href='/platform' onClick={closeMenu} className={styles.icon}>
                    <span className={styles.area}>
                        <LogoIco animate />
                        <span className={styles.shadow} />
                    </span>
                </Link>

                <div className={styles.search}>
                    <div className={styles.frame}>
                        <PllatformSearch />
                    </div>
                </div>
                
                <div className={styles.actions}>
                    {/* <div className={styles.theme}>
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
                    </div> */}
                    <div className={styles.buttons}>
                        <Button 
                            className={styles.button} 
                            variant='default'
                            as="a"
                            href={authLinks.login}
                            // target="_blank"
                            rel="noopener noreferrer"
                        >
                            Пригласить
                        </Button>
                        <Button 
                            className={styles.button} 
                            variant='default'
                            as="a"
                            href={authLinks.login}
                            // target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Bell className={styles.svg} />
                        </Button>
                    </div>
                    
                    {user && (
                    <div className={styles.account}>
                        <span 
                        className={styles.avatar}
                        >
                        {user.avatar_url ? (
                            <span 
                                className={styles.img} 
                                style={{backgroundImage: `url('${user.avatar_url}')`}} 
                            />
                        ) : (
                            // Рандомный яркий градиент
                            <span 
                                className={`${styles.img} ${styles.gradient}`}
                                style={{ 
                                    background: getRandomGradient(user)
                                }}
                            >
                                {/* Можно добавить первую букву имени */}
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        )}
                        </span>
                    </div>
                    )}
                    {/* <div className={styles.burger} onClick={toggleMenu}>
                        {isMenuOpen ? (
                            <Close className={styles.svg} />
                        ) : (
                            <Menu className={styles.svg} />
                        )}
                    </div> */}
                </div>
            </header>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className={styles.menu}>
                    <div className={styles.sections}>
                        {/* {navigationConfig.map((item) => {
                            if (item.out) {
                                return (
                                    <a 
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={clsx(styles.section, isSectionActive(pathname, item) && styles.active)}
                                        onClick={closeMenu}
                                    >
                                        <span className={styles.name}>{item.name}</span>
                                        <span className={styles.icon}><OutLink className={styles.svg} /></span>
                                    </a>
                                );
                            }

                            return (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(styles.section, isSectionActive(pathname, item) && styles.active)}
                                    onClick={closeMenu}
                                >
                                    <span className={styles.name}>{item.name}</span>
                                </Link>
                            );
                        })} */}
                    </div>
                    {/* <div className={styles.actions}>
                        <Button 
                            className={styles.button} 
                            variant='contrast'
                            as="a"
                            href={authLinks.login}
                            // target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                        >
                            Войти
                        </Button>
                    </div> */}
                </div>
            )}
        </>
    );
}