'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './block.module.scss';
import { Counter } from '../../../(overview)/page';
import { adminAccountsApi } from '@/apps/admin/accounts/api';
import { UserStats } from '@/apps/admin/accounts/types';

export interface AccountsStatsBlockProps {
    className?: string;
}

export function AccountsStatsBlock({ className }: AccountsStatsBlockProps) {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAccountsApi.getUserStats();
                if (response.status && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch accounts stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={clsx(styles.container, className)}>
                <Counter value="..." legend="Загрузка..." className={styles.col} />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className={clsx(styles.container, className)}>
                <Counter value="0" legend="Нет данных" className={styles.col} />
            </div>
        );
    }

    return (
        <div className={clsx(styles.container, className)}>
            <Counter 
                value={stats.total_accounts} 
                legend="Всего аккаунтов" 
                className={styles.col} 
            />
            <Counter 
                value={stats.confirmed_accounts} 
                legend="Подтверждённых" 
                variant="good"
                className={styles.col} 
            />
            <Counter 
                value={stats.waiting_accounts} 
                legend="Ожидают подтверждения" 
                variant={stats.waiting_accounts > 0 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.admin_accounts} 
                legend="Администраторов платформы" 
                variant="normal"
                className={styles.col} 
            />
        </div>
    );
}