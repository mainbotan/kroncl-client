'use client';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';
import { GroupedStats } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './chart.module.scss';

interface CategoriesChartProps {
    data: GroupedStats[];
    loading?: boolean;
}

export function CategoriesChart({ data, loading }: CategoriesChartProps) {
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

    const formatValue = (value: number) => {
        return value.toLocaleString('ru-RU');
    };

    const formatTooltip = (value: number) => {
        return [`${value.toLocaleString('ru-RU')} ₽`, ''];
    };

    // Сортируем по убыванию net и берем топ-10 для читаемости
    const sortedData = [...data]
        .sort((a, b) => Math.abs(b.net) - Math.abs(a.net))
        .slice(0, 10);

    return (
        <div className={styles.chart}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 100, bottom: 10 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="var(--color-stroke-secondary)" 
                        horizontal={true}
                        vertical={false}
                    />
                    <XAxis 
                        type="number"
                        tickFormatter={formatValue}
                        tick={{ fill: 'var(--color-text-description)', fontSize: 13 }}
                        axisLine={{ stroke: 'var(--color-stroke-primary)' }}
                        tickLine={false}
                    />
                    <YAxis 
                        type="category"
                        dataKey="group_name"
                        tick={{ fill: 'var(--color-text-primary)', fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                        width={15}
                    />
                    <Tooltip 
                        formatter={formatTooltip}
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
                    <Bar 
                        dataKey="income" 
                        name="Доход"
                        fill="var(--color-green)" 
                        radius={[0, 4, 4, 0]}
                    />
                    <Bar 
                        dataKey="expense" 
                        name="Расход"
                        fill="var(--color-red)" 
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}