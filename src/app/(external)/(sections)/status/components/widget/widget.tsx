'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';

export interface PlatformStatusWidgetProps {
    className?: string;
}

export function PlatformStatusWidget({
    className
}: PlatformStatusWidgetProps) {
    return (
        <Link href='/status' className={clsx(styles.container, className, styles.normal)}>
            <span className={styles.indicator} />
            <span className={styles.text}>Система стабильна</span>
        </Link>
    )
}