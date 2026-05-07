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
import { adminServerApi } from '@/apps/admin/server/api';
import { MetricsServerSnapshot } from '@/apps/admin/server/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import clsx from 'clsx';
import styles from './chart.module.scss';

interface ServerHistoryChartProps {
    className?: string;
    days?: number;
    limit?: number;
    snapshots?: MetricsServerSnapshot[];
    refreshInterval?: number;
}

interface ChartData {
    time: string;
    avg_response_time_ms: number;
    p95_response_time_ms: number;
    requests_total: number;
    requests_5xx_total: number;
    requests_4xx_total: number;
    goroutines_count: number;
    heap_alloc_mb: number;
    gc_duration_ms: number;
    memory_usage_mb: number;
    open_fds_count: number;
}

export function ServerHistoryChart({ 
    className, 
    days = 7, 
    limit = 100, 
    snapshots,
    refreshInterval = 60000
}: ServerHistoryChartProps) {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchHistory = async () => {
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
            const response = await adminServerApi.getHistory({
                start_date: startDate.toISOString(),
                limit: limit,
            });

            if (response.status && response.data) {
                const formattedData = formatSnapshots(response.data);
                setData(formattedData);
            } else {
                setError('Не удалось загрузить историю сервера');
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

        if (refreshInterval > 0 && !snapshots) {
            intervalRef.current = setInterval(fetchHistory, refreshInterval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [days, limit, snapshots, refreshInterval]);

    const formatSnapshots = (snapshotsData: MetricsServerSnapshot[]): ChartData[] => {
        const reversedData = [...snapshotsData].reverse();
        
        return reversedData.map((item) => ({
            time: new Date(item.recorded_at).toLocaleString(),
            avg_response_time_ms: item.avg_response_time_ms,
            p95_response_time_ms: item.p95_response_time_ms,
            requests_total: item.requests_total,
            requests_5xx_total: item.requests_5xx_total,
            requests_4xx_total: item.requests_4xx_total,
            goroutines_count: item.goroutines_count,
            heap_alloc_mb: item.heap_alloc_mb,
            gc_duration_ms: item.gc_duration_ms,
            memory_usage_mb: item.memory_usage_mb,
            open_fds_count: item.open_fds_count,
        }));
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
            {/* Главный график */}
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2560ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2560ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="p95Gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f63939" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f63939" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="errorsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="goroutinesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        
                        <Area yAxisId="left" type="monotone" dataKey="avg_response_time_ms" name="Среднее время (мс)" stroke="#2560ff" strokeWidth={2} fill="url(#avgGradient)" />
                        <Area yAxisId="left" type="monotone" dataKey="p95_response_time_ms" name="P95 время (мс)" stroke="#f63939" strokeWidth={2} fill="url(#p95Gradient)" />
                        <Area yAxisId="right" type="monotone" dataKey="requests_total" name="Запросов" stroke="#34d399" strokeWidth={2} fill="url(#requestsGradient)" />
                        <Area yAxisId="right" type="monotone" dataKey="requests_5xx_total" name="Ошибок 5xx" stroke="#fb923c" strokeWidth={2} fill="url(#errorsGradient)" />
                        <Area yAxisId="right" type="monotone" dataKey="goroutines_count" name="Горутин" stroke="#f472b6" strokeWidth={2} fill="url(#goroutinesGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Отдельные графики */}
            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Heap Alloc (MB)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="heapGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4e20c3" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4e20c3" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="heap_alloc_mb" name="Heap Alloc" stroke="#4e20c3" strokeWidth={2} fill="url(#heapGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Memory Usage (MB)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="memory_usage_mb" name="RSS" stroke="#22d3ee" strokeWidth={2} fill="url(#memoryGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>GC пауза (мс)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gcGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="gc_duration_ms" name="GC пауза" stroke="#facc15" strokeWidth={2} fill="url(#gcGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Открытые файловые дескрипторы</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fdsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f63939" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f63939" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="open_fds_count" name="FDs" stroke="#f63939" strokeWidth={2} fill="url(#fdsGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}