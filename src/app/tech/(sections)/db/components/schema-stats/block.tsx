'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from '../summary-stats/block.module.scss';
import { Counter } from '../../../(overview)/page';
import { adminDbApi } from '@/apps/admin/db/api';
import { SchemaStats } from '@/apps/admin/db/types';

export interface SchemaStatsBlockProps {
    className?: string;
    schemaName: string;
}

export function SchemaStatsBlock({ className, schemaName }: SchemaStatsBlockProps) {
    const [stats, setStats] = useState<SchemaStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminDbApi.getSchemaStats(schemaName);
                if (response.status && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch schema stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (schemaName) {
            fetchStats();
        }
    }, [schemaName]);

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

    const isCompany = stats.schema_name.startsWith('company_');

    return (
        <div className={clsx(styles.container, className)}>
            <Counter 
                value={stats.schema_size_mb} 
                legend="МБ. Размер схемы" 
                variant={stats.schema_size_mb > 1024 ? "critical" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.tables_count} 
                legend="Таблиц" 
                className={styles.col} 
            />
            <Counter 
                value={stats.indexes_count} 
                legend="Индексов" 
                className={styles.col} 
            />
            <Counter 
                variant={stats.migration_dirty ? "critical" : "good"} 
                value={stats.migration_version} 
                legend={stats.migration_dirty ? "Грязная миграция" : "Версия миграции"} 
                className={styles.col} 
            />
        </div>
    );
}