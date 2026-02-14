'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Sector
} from 'recharts';
import { useFm } from '@/apps/company/modules';
import { GroupedStats, GroupBy } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './chart.module.scss';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import clsx from 'clsx';

const COLORS = [
    'var(--color-accent)',
    'var(--color-green)',
    'var(--color-orange)',
    'var(--color-red)',
    'var(--color-purple)',
    'var(--color-blue)',
    'var(--color-teal)',
    'var(--color-pink)',
];

const chartVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    },
    exit: { 
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

export interface GroupChartProps {
    groupBy?: GroupBy;
    period?: 'week' | 'month' | 'quarter' | 'year';
    className?: string;
    variant?: 'bar' | 'pie' | 'both';
    onDataLoad?: (data: GroupedStats[]) => void;
}

export function GroupChart({ 
    groupBy = 'category',
    period = 'month',
    className,
    variant = 'bar',
    onDataLoad
}: GroupChartProps) {
    const params = useParams();
    const companyId = params.id as string;
    const fmModule = useFm();
    
    const [data, setData] = useState<GroupedStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartType, setChartType] = useState<'bar' | 'pie'>(variant === 'both' ? 'bar' : variant);

    useEffect(() => {
        loadData();
    }, [groupBy, period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const endDate = new Date();
            const startDate = new Date();
            
            switch (period) {
                case 'week':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case 'year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
            }

            const response = await fmModule.getGroupedAnalysis({
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                group_by: groupBy
            });
            
            if (response.status) {
                setData(response.data);
                onDataLoad?.(response.data);
            }
        } catch (error) {
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
        
        return (
            <g>
                <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="var(--color-text-primary)" fontSize={12}>
                    {payload.group_name}
                </text>
                <text x={cx} y={cy + 5} dy={8} textAnchor="middle" fill="var(--color-text-primary)" fontWeight="600" fontSize={13}>
                    {value.toLocaleString('ru-RU')} ₽
                </text>
                <text x={cx} y={cy + 25} dy={8} textAnchor="middle" fill="var(--color-text-description)" fontSize={11}>
                    {(percent * 100).toFixed(1)}%
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 10}
                    outerRadius={outerRadius + 12}
                    fill={fill}
                />
            </g>
        );
    };

    const formatValue = (value: number) => value.toLocaleString('ru-RU');

    if (loading) {
        return (
            <motion.div 
                className={clsx(styles.chart, styles.loading, className)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Spinner />
            </motion.div>
        );
    }

    if (data.length === 0) {
        return (
            <motion.div 
                className={clsx(styles.chart, styles.empty, className)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Нет данных за выбранный период
            </motion.div>
        );
    }

    return (
        <motion.div 
            className={clsx(styles.chart, className)}
            variants={chartVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {variant === 'both' && (
                <div className={styles.toggle}>
                    <button 
                        className={clsx(styles.toggleBtn, chartType === 'bar' && styles.active)}
                        onClick={() => setChartType('bar')}
                    >
                        📊
                    </button>
                    <button 
                        className={clsx(styles.toggleBtn, chartType === 'pie' && styles.active)}
                        onClick={() => setChartType('pie')}
                    >
                        🥧
                    </button>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div 
                    key={chartType}
                    className={styles.container}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                            <BarChart
                                data={data}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                layout="vertical"
                            >
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    stroke="var(--color-stroke-secondary)" 
                                    horizontal={false}
                                />
                                <XAxis 
                                    type="number"
                                    tickFormatter={formatValue}
                                    tick={{ fill: 'var(--color-text-description)', fontSize: 10 }}
                                    axisLine={{ stroke: 'var(--color-stroke-primary)' }}
                                    tickLine={false}
                                />
                                <YAxis 
                                    type="category"
                                    dataKey="group_name"
                                    width={100}
                                    tick={{ fill: 'var(--color-text-primary)', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    formatter={(value: number) => [`${formatValue(value)} ₽`, '']}
                                    contentStyle={{
                                        backgroundColor: 'var(--color-surface-elevated)',
                                        border: '1px solid var(--color-stroke-primary)',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        padding: '4px 8px'
                                    }}
                                />
                                <Bar 
                                    dataKey="income" 
                                    stackId="a"
                                    fill="var(--color-green)" 
                                    radius={[0, 4, 4, 0]}
                                />
                                <Bar 
                                    dataKey="expense" 
                                    stackId="a"
                                    fill="var(--color-red)" 
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        ) : (
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={data.map(item => ({
                                        name: item.group_name,
                                        value: Math.abs(item.net),
                                        ...item
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={65}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                >
                                    {data.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="var(--color-surface-elevated)"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => [`${formatValue(value)} ₽`, '']}
                                    contentStyle={{
                                        backgroundColor: 'var(--color-surface-elevated)',
                                        border: '1px solid var(--color-stroke-primary)',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        padding: '4px 8px'
                                    }}
                                />
                            </PieChart>
                        )}
                    </ResponsiveContainer>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}