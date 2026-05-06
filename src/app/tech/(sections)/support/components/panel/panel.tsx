'use client';

import clsx from 'clsx';
import styles from './panel.module.scss';

export interface SupportPanelProps {
    className?: String;
}

export function SupportPanel({
    className
}: SupportPanelProps) {
    return (
        <div className={clsx(styles.container, className)}>

        </div>
    )
}