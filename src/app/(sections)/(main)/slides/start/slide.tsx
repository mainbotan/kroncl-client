'use client';

import Location from '@/assets/ui-kit/icons/location';
import styles from './slide.module.scss';
import Account from '@/assets/ui-kit/icons/account';
import { useEffect, useState } from 'react';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Business from '@/assets/ui-kit/icons/business';
import Dev from '@/assets/ui-kit/icons/dev';
import Shop from '@/assets/ui-kit/icons/shop';
import Auto from '@/assets/ui-kit/icons/auto';
import Button from '@/assets/ui-kit/button/button';
import { authLinks } from '@/config/links.config';
import clsx from 'clsx';

export function StartSlide() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const subjects = [
        {
            icon: <Business className={styles.svg} />,
            text: 'предприятиям',
            color: 'var(--color-brand)'
        },
        {
            icon: <Auto className={styles.svg} />,
            text: 'автосервисам',
            color: '#ff6b6b'
        },
        {
            icon: <Dev className={styles.svg} />,
            text: 'разработчикам',
            color: '#e17231ff'
        },
        {
            icon: <Shop className={styles.svg} />,
            text: 'магазинам',
            color: '#f566ffff'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            // Сначала скрываем текущий элемент
            setIsVisible(false);
            
            // Через время сменяем индекс и показываем новый
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % subjects.length);
                setIsVisible(true);
            }, 300); // Время исчезновения
        }, 3000);

        return () => clearInterval(interval);
    }, [subjects.length]);

    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.slogan}>
                    {/* <div className={styles.capture}>
                        <LogoText animate />
                    </div> */}
                    <div className={styles.subject}>
                        <div className={styles.container}>
                            <div className={`${styles.word} ${isVisible ? styles.visible : styles.hidden}`}
                                 style={{ color: subjects[currentIndex].color }}>
                                <span className={styles.icon}>{subjects[currentIndex].icon}</span>
                                <span className={styles.name}>{subjects[currentIndex].text}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.title}>
                        <span className={styles.brand}>Обгоните</span> конкурентов. <br />
                        Обгоните <span className={styles.brand}>время.</span>
                    </div>
                </div>
                <div className={styles.description}>
                    ERP-lite система учёта и планирования малого бизнеса. <br />
                    Автоматизируйте рутинную бухгалтерию. 
                </div>
                {/* <div className={styles.description}>
                    <LogoText /> - волшебная палочка мелкого и малого бизнеса.
                    Мы объединяем функционал CRM, упрощённого складского учёта, финансы и <span className={styles.accent}>множество других модулей</span> в составе простейшей для внедрения <span className={styles.accent}>ERP lite.</span> 
                </div> */}
                <div className={styles.actions}>
                    <Button 
                        className={clsx(styles.action, styles.accent)} 
                        variant='accent'
                        as="a"
                        href={authLinks.registration}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Создать аккаунт
                        <span className={styles.circle} />
                        <span className={styles.circle} />
                        <span className={styles.circle} />
                        <span className={styles.addition}>бесплатно</span>
                    </Button>
                    <Button 
                        className={styles.action} 
                        variant='glass'
                        as="a"
                        href={authLinks.login}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    );
}