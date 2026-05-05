'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './block.module.scss';
import { Counter } from '../../../(overview)/page';
import { adminClienteleApi } from '@/apps/admin/clientele/api';
import { MetricsClienteleSnapshot } from '@/apps/admin/clientele/types';

export interface ClienteleStatsBlockProps {
    className?: string;
}

export function ClienteleStatsBlock({ className }: ClienteleStatsBlockProps) {
    const [stats, setStats] = useState<MetricsClienteleSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminClienteleApi.getStats();
                if (response.status && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch clientele stats:', error);
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
                variant={stats.confirmed_accounts > 0 ? "good" : "normal"}
                value={stats.confirmed_accounts} 
                legend="Подтверждённых" 
                className={styles.col} 
            />
            <Counter 
                value={stats.total_companies} 
                legend="Всего компаний" 
                className={styles.col} 
            />
            <Counter 
                value={stats.public_companies} 
                legend="Публичных компаний" 
                className={styles.col} 
            />
            <Counter 
                value={stats.private_companies} 
                legend="Приватных компаний" 
                className={styles.col} 
            />
            
            <Counter 
                value={stats.total_company_accounts} 
                legend="Связей аккаунт-компания" 
                className={styles.col} 
            />
            <Counter 
                value={stats.avg_accounts_per_company} 
                legend="Сред. аккаунтов на компанию" 
                className={styles.col} 
                format={(v) => typeof v === 'number' ? v.toFixed(2) : String(v)}
            />
            <Counter 
                value={stats.max_accounts_in_company} 
                legend="Макс. аккаунтов в компании" 
                className={styles.col} 
            />
            
            <Counter 
                value={stats.active_companies_7d} 
                legend="Активных компаний (7 дней)" 
                variant={stats.active_companies_7d > 0 ? "good" : "critical"}
                className={styles.col} 
            />
            <Counter 
                value={stats.active_companies_30d} 
                legend="Активных компаний (30 дней)" 
                variant={stats.active_companies_30d > 0 ? "good" : "critical"}
                className={styles.col} 
            />
            
            <Counter 
                value={stats.total_transactions} 
                legend="Транзакций (платажей)" 
                className={styles.col} 
            />
            <Counter 
                variant="good"
                value={stats.success_transactions} 
                legend="Успешных транзакций" 
                className={styles.col} 
            />
            <Counter 
                variant={stats.pending_transactions > 0 ? "warning" : "good"}
                value={stats.pending_transactions} 
                legend="Транзакций ожидают обработки" 
                className={styles.col} 
            />
            <Counter 
                value={stats.trial_transactions} 
                legend="Триальных транзакций" 
                className={styles.col} 
            />
            
            <Counter 
                variant={stats.company_schemas_without_data > 0 ? "critical" : "good"}
                value={stats.company_schemas_without_data} 
                legend="Схем без данных" 
                className={styles.col} 
            />
        </div>
    );
}