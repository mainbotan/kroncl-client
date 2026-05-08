'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { statusApi } from '@/apps/status/api';
import { SystemStatus } from '@/apps/status/types';

const statusConfig: Record<SystemStatus, { label: string; className: string }> = {
    operational: { label: 'Система стабильна', className: styles.normal },
    degraded: { label: 'Деградация', className: styles.minor },
    partial_outage: { label: 'Частичный сбой', className: styles.major },
    major_outage: { label: 'Крупный сбой', className: styles.critical },
};

export interface PlatformStatusWidgetProps {
    className?: string;
}

export function PlatformStatusWidget({ className }: PlatformStatusWidgetProps) {
    const [status, setStatus] = useState<SystemStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await statusApi.getSystemStatus(1);
                if (response.status && response.data) {
                    setStatus(response.data.current_status);
                }
            } catch (error) {
                console.error('Failed to fetch platform status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className={clsx(styles.container, className, styles.normal)}>
                <span className={styles.indicator} />
                <span className={styles.text}>Загрузка...</span>
            </div>
        );
    }

    const current = status ? statusConfig[status] : statusConfig.operational;

    return (
        <Link href='/status' className={clsx(styles.container, className, current.className)}>
            <span className={styles.indicator} />
            <span className={styles.text}>{current.label}</span>
        </Link>
    );
}