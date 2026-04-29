'use client';

import clsx from 'clsx';
import styles from './block.module.scss';
import React from 'react';
import Question from '@/assets/ui-kit/icons/question';
import InfoCircle from '@/assets/ui-kit/icons/info';

export interface MDXInfoBlockProps {
    className?: string;
    type?: 'info' | 'advice' | 'deprecated' | 'warning';
    title?: string;
    children?: React.ReactNode;
}

export const getBlockTypeLabel = (id: string): string => {
    const names: Record<string, string> = {
        info: 'Информация',
        advice: 'Совет',
        deprecated: 'Предупреждение | Устаревший функционал',
        warning: 'Предупреждение',
    };
    return names[id] || id;
};

export function MDXInfoBlock({
    className,
    type = 'warning',
    title,
    children
}: MDXInfoBlockProps) {
    return (
        <div className={clsx(styles.container, styles[type], className)}>
            <InfoCircle className={styles.marker} />
            <div className={styles.tag}>{getBlockTypeLabel(type)}</div>
            <div className={styles.title}>
                {title || 'Инфоблок'}
            </div>
            <div className={styles.about}>{children || 'Мы ещё работаем над этим блоком.'}</div>
        </div>
    )
}