'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDm } from '@/apps/company/modules';
import { GroupedStats } from '@/apps/company/modules/dm/types';
import { DailyChart } from '../../analysis/components/daily-chart/chart';

export interface DMDynamicsWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function DMDynamicsWidget({
    className,
    variant = 'default'
}: DMDynamicsWidgetProps) {
    const params = useParams();
    const companyId = params.id;
    const dmModule = useDm();

    const [dailyData, setDailyData] = useState<GroupedStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const dailyRes = await dmModule.getAnalysisGrouped({
                group_by: 'day'
            });
            
            if (dailyRes.status) {
                if (dailyRes.data && dailyRes.data.length > 0) {
                    const sorted = [...dailyRes.data].sort((a, b) => 
                        a.group_key.localeCompare(b.group_key)
                    );
                    setDailyData(sorted);
                } else {
                    setDailyData([]);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading DM dynamics:', err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Link href={`/platform/${companyId}/dm/analysis`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>сделок</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && !error && (
                <>
                <div className={styles.title}>
                    Динамика сделок
                </div>
                <div className={styles.description}>Активность по дням</div>
                <DailyChart className={styles.chart} data={dailyData} loading={loading} />
                </>
            )}
        </Link>
    )
}