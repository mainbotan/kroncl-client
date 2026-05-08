'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './block.module.scss';
import { Counter } from '../../../overview/counter';
import { adminServerApi } from '@/apps/admin/server/api';
import { MetricsServerSnapshot } from '@/apps/admin/server/types';

export interface ServerStatsBlockProps {
    className?: string;
}

export function ServerStatsBlock({ className }: ServerStatsBlockProps) {
    const [stats, setStats] = useState<MetricsServerSnapshot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminServerApi.getStats();
                if (response.status && response.data) {
                    setStats(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch server stats:', error);
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

    // Статус системы на основе воркеров
    const isDbWorkerHealthy = stats.db_worker_success;
    const isClienteleWorkerHealthy = stats.clientele_worker_success;
    const isSystemHealthy = isDbWorkerHealthy && isClienteleWorkerHealthy;

    return (
        <div className={clsx(styles.container, className)}>
            <Counter 
                variant={isSystemHealthy ? "good" : "critical"}
                value={isSystemHealthy ? "Ok" : "D"} 
                legend="Статус системы (Ok / Degraded)" 
                className={styles.col} 
            />

            <Counter 
                value={stats.requests_total} 
                legend="Всего запросов" 
                className={styles.col} 
            />
            <Counter 
                variant={stats.requests_5xx_total > 0 ? "critical" : "good"}
                value={stats.requests_5xx_total} 
                legend="Ошибок 5xx" 
                className={styles.col} 
            />
            <Counter 
                variant={stats.requests_4xx_total > 100 ? "warning" : "good"}
                value={stats.requests_4xx_total} 
                legend="Ошибок 4xx" 
                className={styles.col} 
            />
            
            <Counter 
                value={stats.avg_response_time_ms} 
                legend="Среднее время ответа (мс)" 
                variant={stats.avg_response_time_ms > 500 ? "critical" : stats.avg_response_time_ms > 200 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.p95_response_time_ms} 
                legend="P95 время ответа (мс)" 
                variant={stats.p95_response_time_ms > 1000 ? "critical" : stats.p95_response_time_ms > 300 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.active_connections} 
                legend="Активных соединений" 
                variant={stats.active_connections > 1000 ? "warning" : "good"}
                className={styles.col} 
            />
            
            <Counter 
                value={stats.goroutines_count} 
                legend="Горутин" 
                variant={stats.goroutines_count > 10000 ? "critical" : stats.goroutines_count > 5000 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.heap_alloc_mb} 
                legend="Heap Alloc (MB)" 
                variant={stats.heap_alloc_mb > 1024 ? "critical" : stats.heap_alloc_mb > 512 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.heap_inuse_mb} 
                legend="Heap Inuse (MB)" 
                className={styles.col} 
            />
            <Counter 
                value={stats.gc_duration_ms} 
                legend="GC пауза (мс)" 
                variant={stats.gc_duration_ms > 100 ? "critical" : stats.gc_duration_ms > 50 ? "warning" : "good"}
                className={styles.col} 
            />
            
            <Counter 
                value={stats.memory_usage_mb} 
                legend="RSS память (MB)" 
                variant={stats.memory_usage_mb > 2048 ? "critical" : stats.memory_usage_mb > 1024 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.open_fds_count} 
                legend="Открытых FD" 
                variant={stats.open_fds_count > 1000 ? "critical" : stats.open_fds_count > 500 ? "warning" : "good"}
                className={styles.col} 
            />
            <Counter 
                value={stats.cpu_usage_percent} 
                legend="CPU (%)" 
                variant={stats.cpu_usage_percent > 80 ? "critical" : stats.cpu_usage_percent > 50 ? "warning" : "good"}
                className={styles.col} 
                format={(v) => typeof v === 'number' ? v.toFixed(1) : String(v)}
            />
        </div>
    );
}