'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './block.module.scss';
import { Counter } from '../../../(overview)/page';
import { adminDbApi } from '@/apps/admin/db/api';
import { SystemStats } from '@/apps/admin/db/types';

export interface SummaryStatsBlockProps {
    className?: string;
}

export function SummaryStatsBlock({ className }: SummaryStatsBlockProps) {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminDbApi.getSystemStats();
                if (response.status && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch system stats:', error);
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
                value={stats.total_database_size_mb} 
                legend="МБ. Общий размер инстанса базы" 
                variant={stats.total_database_size_mb > 1024 ? "critical" : "good"}
                className={styles.col} 
            />
            <Counter 
                variant={stats.company_schemas_count > 200 ? "critical" : "good"} 
                value={stats.company_schemas_count} 
                legend="Схем организаций" 
                className={styles.col} 
            />
            <Counter 
                value={stats.total_schemas_count} 
                legend="Всего схем" 
                className={styles.col} 
            />
            <Counter 
                value={stats.total_tables_count} 
                legend="Таблиц, включая системные" 
                className={styles.col} 
            />
            <Counter 
                value={stats.total_indexes_count} 
                legend="Индексов" 
                className={styles.col} 
            />
            <Counter 
                variant={stats.total_active_connections > 1000 ? "critical" : "good"} 
                value={stats.total_active_connections} 
                legend="Активных подключений" 
                className={styles.col} 
            />
        </div>
    );
}