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
import { adminClienteleApi } from '@/apps/admin/clientele/api';
import { MetricsClienteleSnapshot } from '@/apps/admin/clientele/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import clsx from 'clsx';
import styles from './chart.module.scss';

interface ClienteleHistoryChartProps {
    className?: string;
    days?: number;
    limit?: number;
    snapshots?: MetricsClienteleSnapshot[];
    refreshInterval?: number;
}

interface ChartData {
    time: string;
    total_accounts: number;
    total_companies: number;
    avg_accounts_per_company: number;
    total_transactions: number;
    success_transactions: number;
    active_companies_7d: number;
    total_company_accounts: number;
}

export function ClienteleHistoryChart({ 
    className, 
    days = 30, 
    limit = 100, 
    snapshots,
    refreshInterval = 60000
}: ClienteleHistoryChartProps) {
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
            const response = await adminClienteleApi.getHistory({
                start_date: startDate.toISOString(),
                limit: limit,
            });

            if (response.status && response.data) {
                const formattedData = formatSnapshots(response.data);
                setData(formattedData);
            } else {
                setError('Не удалось загрузить историю клиентуры');
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

    const formatSnapshots = (snapshotsData: MetricsClienteleSnapshot[]): ChartData[] => {
        const reversedData = [...snapshotsData].reverse();
        
        return reversedData.map((item) => ({
            time: new Date(item.recorded_at).toLocaleString(),
            total_accounts: item.total_accounts,
            total_companies: item.total_companies,
            avg_accounts_per_company: item.avg_accounts_per_company,
            total_transactions: item.total_transactions,
            success_transactions: item.success_transactions,
            active_companies_7d: item.active_companies_7d,
            total_company_accounts: item.total_company_accounts,
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
            {/* Главный график со всеми метриками */}
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="accountsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2560ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2560ff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="companiesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="transactionsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f472b6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        
                        <Area yAxisId="left" type="monotone" dataKey="total_accounts" name="Аккаунты" stroke="#2560ff" strokeWidth={2} fill="url(#accountsGradient)" />
                        <Area yAxisId="left" type="monotone" dataKey="total_companies" name="Компании" stroke="#34d399" strokeWidth={2} fill="url(#companiesGradient)" />
                        <Area yAxisId="left" type="monotone" dataKey="total_transactions" name="Транзакции" stroke="#fb923c" strokeWidth={2} fill="url(#transactionsGradient)" />
                        <Area yAxisId="right" type="monotone" dataKey="active_companies_7d" name="Активные компании (7д)" stroke="#f472b6" strokeWidth={2} fill="url(#activeGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Отдельные графики */}
            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Среднее аккаунтов на компанию</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4e20c3" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4e20c3" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="avg_accounts_per_company" name="Среднее" stroke="#4e20c3" strokeWidth={2} fill="url(#avgGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Успешные транзакции</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="success_transactions" name="Успешные" stroke="#34d399" strokeWidth={2} fill="url(#successGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chartWrapper}>
                <h4 className={styles.title}>Связи аккаунт-компания</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="relationsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stroke-secondary)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fill: 'var(--color-text-description)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-stroke-primary)' }} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-stroke-primary)', borderRadius: '6px', fontSize: '13px' }} />
                        <Area type="monotone" dataKey="total_company_accounts" name="Связи" stroke="#22d3ee" strokeWidth={2} fill="url(#relationsGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}