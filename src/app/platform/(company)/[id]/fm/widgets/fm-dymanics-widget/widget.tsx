'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFm } from '@/apps/company/modules';
import { GetAnalysisParams } from '@/apps/company/modules/crm/types';
import { AnalysisSummary, GroupedStats } from '@/apps/company/modules/fm/types';
import { DailyChart } from '../../e2e/components/daily-chart/chart';

export interface FMDynamicsWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function FMDynamicsWidget({
    className,
    variant = 'default'
}: FMDynamicsWidgetProps) {
    const params = useParams();
    const companyId = params.id;
    const fmModule = useFm();

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
            const [dailyRes] = await Promise.all([
                fmModule.getGroupedAnalysis({
                    ...params,
                    group_by: 'day'
                } as GetAnalysisParams & { group_by: 'day' })
            ]);
            
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
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка загрузки");
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Link href={`/platform/${companyId}/fm/e2e`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>финансов</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && !error && (
                <>
                <div className={styles.title}>
                    Динамика операций
                </div>
                <div className={styles.description}>Управление финансами</div>
                <DailyChart className={styles.chart} data={dailyData} loading={loading} />
                </>
            )}
        </Link>
    )
}