import clsx from 'clsx';
import { type PropsWithChildren } from 'react';
import styles from './styles.module.scss';
import Arrow from '@/assets/ui-kit/icons/arrow';

interface LeftBlockProps {
  className?: string;
}

export function RightBlock({ className = '' }: PropsWithChildren<LeftBlockProps>) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.area}>
                <div className={styles.title}><span className={styles.contrast}>Увеличьте пенис.</span> Прямо сейчас.</div>
                <div className={styles.description}>Цена в объявлении указана с учётом обмена на неисправный.</div>
                <div className={styles.link}><span className={styles.circle}><Arrow className={styles.svg} /></span></div>
            </div>

            <svg className={styles.art} viewBox="0 0 271 366" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 177.926L107.5 352.926L270.5 250.926M0.5 177.926L270.5 0.925644V250.926M0.5 177.926V194.069C0.5 195.936 1.02271 197.766 2.00894 199.351L102.18 360.375C105.112 365.087 111.321 366.511 116.013 363.546L265.842 268.869C268.742 267.037 270.5 263.846 270.5 260.415V250.926" />
            </svg>
        </div>
    )
}