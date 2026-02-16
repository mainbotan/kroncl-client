'use client';

import { useEffect, useState } from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';
import { GroupedStats } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './chart.module.scss';

interface DailyChartProps {
    data: GroupedStats[];
    loading?: boolean;
}

export function DailyChart({ data, loading }: DailyChartProps) {
    if (loading) {
        return (
            <div className={styles.loading}>
                <Spinner />
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

    const formatTooltip = (value: number) => {
        return [`${value.toLocaleString('ru-RU')} ₽`, ''];
    };

    return (
        <div className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-green)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--color-green)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-red)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--color-red)" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="var(--color-stroke-secondary)" 
                        vertical={false}
                    />
                    <XAxis 
                        dataKey="group_name" 
                        tick={{ fill: 'var(--color-text-description)', fontSize: 11 }}
                        axisLine={{ stroke: 'var(--color-stroke-primary)' }}
                        tickLine={false}
                    />
                    {/* YAxis убрали */}
                    <Tooltip 
                        formatter={formatTooltip}
                        labelFormatter={(label) => `Дата: ${label}`}
                        contentStyle={{
                            backgroundColor: 'var(--color-surface-elevated)',
                            border: '1px solid var(--color-stroke-primary)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            padding: '10px 10px'
                        }}
                    />
                    <Legend 
                        wrapperStyle={{ fontSize: '11px', color: 'var(--color-text-primary)' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="income" 
                        name="Доход"
                        stroke="var(--color-green)" 
                        strokeWidth={2}
                        fill="url(#incomeGradient)" 
                    />
                    <Area 
                        type="monotone" 
                        dataKey="expense" 
                        name="Расход"
                        stroke="var(--color-red)" 
                        strokeWidth={2}
                        fill="url(#expenseGradient)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}