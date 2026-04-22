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
import { ModuleStats } from '@/apps/company/modules/storage/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './chart.module.scss';
import { formatSize } from '@/assets/utils/size';
import clsx from 'clsx';

export const getModuleName = (id: string): string => {
    const names: Record<string, string> = {
        hrm: 'Управление персоналом',
        fm: 'Финансы',
        crm: 'Клиентская база',
        wm: 'Каталог и склад',
        dm: 'Сделки'
    };
    return names[id] || id;
};

interface ModulesChartProps {
    modules: ModuleStats[];
    loading?: boolean;
    className?: string;
}

export function ModulesChart({ modules, loading, className }: ModulesChartProps) {
    if (loading) {
        return (
            <div className={clsx(styles.loading, className)}>
                <Spinner />
            </div>
        );
    }

    if (!modules || modules.length === 0) {
        return (
            <div className={clsx(styles.empty, className)}>
                Нет данных за выбранный период
            </div>
        );
    }

    const totalSize = modules.reduce((sum, m) => sum + m.total_size_mb, 0);

    const formatTooltip = (value: number, name: string, props: any) => {
        const percent = totalSize > 0 ? ((value / totalSize) * 100).toFixed(1) : 0;
        return [`${formatSize(value, false)} (${percent}%)`, ''];
    };

    const sortedData = [...modules]
        .sort((a, b) => b.total_size_mb - a.total_size_mb)
        .map(item => ({
            ...item,
            module_name: getModuleName(item.module)
        }));

    return (
        <div className={clsx(styles.chart, className)}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-stroke-secondary)"
                        horizontal={true}
                        vertical={false}
                    />
                    <XAxis
                        type="number"
                        tickFormatter={(v) => formatSize(v, false)}
                        tick={{ fill: 'var(--color-text-description)', fontSize: 13 }}
                        axisLine={{ stroke: 'var(--color-stroke-primary)' }}
                        tickLine={false}
                    />
                    <YAxis
                        type="category"
                        dataKey="module_name"
                        width={140}
                        tick={{ fill: 'var(--color-text-primary)', fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
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
                        dataKey="total_size_mb"
                        name="Размер"
                        fill="var(--color-accent)"
                        radius={[0, 4, 4, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}