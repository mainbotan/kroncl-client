import clsx from 'clsx';
import { type PropsWithChildren } from 'react';
import styles from './styles.module.scss';
import Arrow from '@/assets/ui-kit/icons/arrow';

interface LeftBlockProps {
  className?: string;
}

export function LeftBlock({ className = '' }: PropsWithChildren<LeftBlockProps>) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.area}>
                <div className={styles.title}><span className={styles.contrast}>Увеличьте пенис.</span> Прямо сейчас.</div>
                <div className={styles.description}>
                    Агрегат прошёл все необходимые проверки на тестовом стенде с нагрузкой и готов к установке на машину.
                    Цена в объявлении указана с учётом обмена на неисправный.
                </div>
                <div className={styles.link}><span className={styles.circle}><Arrow className={styles.svg} /></span></div>
            </div>
            <svg className={styles.art} viewBox="0 0 148 376" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.0183105 374.949C102.651 376.464 140.782 125.631 147.018 0.0247955M0.0183105 374.949C103.364 378.737 141.079 238.929 147.018 168.551M0.0183105 374.949C70.4001 374.949 65.0547 162.871 120.291 374.949" stroke="#EE2B79"/>
            </svg>
        </div>
    )
}