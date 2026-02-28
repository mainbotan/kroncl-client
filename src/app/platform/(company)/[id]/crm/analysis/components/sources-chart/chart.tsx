'use client';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { GroupedClientsStats } from '@/apps/company/modules/crm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './chart.module.scss';

interface SourcesChartProps {
    data: GroupedClientsStats[];
    loading?: boolean;
}

export function SourcesChart({ data, loading }: SourcesChartProps) {
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
        return [`${value} клиентов`, ''];
    };

    // Сортируем по убыванию и берем топ-10
    const sortedData = [...data]
        .sort((a, b) => b.clients_count - a.clients_count)
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
                    <Bar 
                        dataKey="clients_count" 
                        name="Клиенты"
                        fill="var(--color-accent)" 
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}