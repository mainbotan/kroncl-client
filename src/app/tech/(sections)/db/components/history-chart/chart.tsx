'use client';

import { useEffect, useState, useRef } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    YAxis
} from 'recharts';
import { adminDbApi } from '@/apps/admin/db/api';
import { MetricsHistoryItem } from '@/apps/admin/db/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import clsx from 'clsx';
import styles from './chart.module.scss';

interface DbHistoryChartProps {
    className?: string;
    days?: number;
    limit?: number;
    snapshots?: MetricsHistoryItem[];
    refreshInterval?: number; // в миллисекундах
}

interface ChartData {
    time: string;
    tps: number;
    size_mb: number;
    cache_hit_ratio: number;
    connections: number;
    tup_inserted: number;
    tup_updated: number;
    tup_deleted: number;
}

export function DbHistoryChart({ 
    className, 
    days = 7, 
    limit = 100, 
    snapshots,
    refreshInterval = 60000 // по умолчанию каждую минуту
}: DbHistoryChartProps) {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchHistory = async () => {
        // Если переданы снапшоты извне, используем их
        if (snapshots) {
            const formattedData = formatSnapshots(snapshots);
            setData(formattedData);
            setLoading(false);
            return;
        }

        setError(null);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        try {
            const response = await adminDbApi.getMetricsHistory({
                start_date: startDate.toISOString(),
                limit: limit,
            });

            if (response.status && response.data) {
                const formattedData = formatSnapshots(response.data);
                setData(formattedData);
            } else {
                setError('Не удалось загрузить историю метрик');
            }
        } catch (err) {
            setError('Ошибка при загрузке данных');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();

        // Настраиваем интервал обновления
        if (refreshInterval > 0 && !snapshots) {
            intervalRef.current = setInterval(fetchHistory, refreshInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [days, limit, snapshots, refreshInterval]);

    const formatSnapshots = (snapshotsData: MetricsHistoryItem[]): ChartData[] => {
        const reversedData = [...snapshotsData].reverse();
        
        return reversedData.map((item, index, arr) => {
            let tps = 0;
            let tupInsertedPerSec = 0;
            let tupUpdatedPerSec = 0;
            let tupDeletedPerSec = 0;
            
            if (index > 0) {
                const prev = arr[index - 1];
                const timeDiff = new Date(item.recorded_at).getTime() - new Date(prev.recorded_at).getTime();
                const txnDiff = (item.xact_commit - prev.xact_commit) + (item.xact_rollback - prev.xact_rollback);
                if (timeDiff > 0) {
                    tps = (txnDiff / timeDiff) * 1000;
                    tupInsertedPerSec = ((item.tup_inserted - prev.tup_inserted) / timeDiff) * 1000;
                    tupUpdatedPerSec = ((item.tup_updated - prev.tup_updated) / timeDiff) * 1000;
                    tupDeletedPerSec = ((item.tup_deleted - prev.tup_deleted) / timeDiff) * 1000;
                }
            }

            const totalIO = item.blks_hit + item.blks_read;
            const cacheHitRatio = totalIO > 0 ? (item.blks_hit / totalIO) * 100 : 0;

            return {
                time: new Date(item.recorded_at).toLocaleString(),
                tps: Math.round(tps * 10) / 10,
                size_mb: item.total_database_size_mb,
                cache_hit_ratio: Math.round(cacheHitRatio),
                connections: item.total_active_connections,
                tup_inserted: Math.round(tupInsertedPerSec),
                tup_updated: Math.round(tupUpdatedPerSec),
                tup_deleted: Math.round(tupDeletedPerSec),
            };
        });
    };

    if (loading && data.length === 0) {
        return (
            <div className={styles.loading}>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.empty}>
                {error}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={styles.empty}>
                Нет данных за выбранный период
            </div>
        );
    }

    return (
        <div className={clsx(styles.chart, className)}>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="insertsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="updatesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="deletesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-error)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="connectionsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-blue)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        
                        <Area yAxisId="left" type="monotone" dataKey="tps" name="TPS" stroke="var(--color-accent)" strokeWidth={2} fill="url(#tpsGradient)" />
                        <Area yAxisId="left" type="monotone" dataKey="tup_inserted" name="Insert/сек" stroke="var(--color-success)" strokeWidth={2} fill="url(#insertsGradient)" />
                        <Area yAxisId="left" type="monotone" dataKey="tup_updated" name="Update/сек" stroke="var(--color-warning)" strokeWidth={2} fill="url(#updatesGradient)" />
                        <Area yAxisId="left" type="monotone" dataKey="tup_deleted" name="Delete/сек" stroke="var(--color-error)" strokeWidth={2} fill="url(#deletesGradient)" />
                        <Area yAxisId="right" type="monotone" dataKey="connections" name="Подключения" stroke="var(--color-blue)" strokeWidth={2} fill="url(#connectionsGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Размер БД (MB)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="sizeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="size_mb" name="Размер" stroke="var(--color-success)" strokeWidth={2} fill="url(#sizeGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>TPS (транзакций в секунду)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="tpsOnlyGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="tps" name="TPS" stroke="var(--color-accent)" strokeWidth={2} fill="url(#tpsOnlyGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Cache Hit Ratio (%)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="cacheGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-warning)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-warning)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} formatter={(value) => [`${value}%`, '']} />
                        <Area type="monotone" dataKey="cache_hit_ratio" name="Cache Hit" stroke="var(--color-warning)" strokeWidth={2} fill="url(#cacheGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Активные подключения</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="connGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-blue)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="connections" name="Подключения" stroke="var(--color-blue)" strokeWidth={2} fill="url(#connGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}