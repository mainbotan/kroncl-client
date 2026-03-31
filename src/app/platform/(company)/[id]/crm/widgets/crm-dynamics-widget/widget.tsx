'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCrm } from '@/apps/company/modules';
import { GetAnalysisParams, GroupedClientsStats } from '@/apps/company/modules/crm/types';
import { AnalysisSummary, GroupedStats } from '@/apps/company/modules/fm/types';
import { DailyChart } from '../../analysis/components/daily-chart/chart';

export interface CRMDynamicsWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function CRMDynamicsWidget({
    className,
    variant = 'default'
}: CRMDynamicsWidgetProps) {
    const params = useParams();
    const companyId = params.id;
    const crmModule = useCrm();

    const [dailyData, setDailyData] = useState<GroupedClientsStats[]>([]);
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
                crmModule.getGroupedClients({
                    ...params,
                    group_by: 'day'
                })
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
        <Link href={`/platform/${companyId}/crm/analysis`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>клиентов</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && !error && (
                <>
                <div className={styles.title}>
                    Динамика трафика
                </div>
                <div className={styles.description}>Клиентская база</div>
                <DailyChart className={styles.chart} data={dailyData} loading={loading} />
                </>
            )}
        </Link>
    )
}