'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCrm, useFm } from '@/apps/company/modules';
import { ClientsSummary, GetAnalysisParams } from '@/apps/company/modules/crm/types';
import { AnalysisSummary } from '@/apps/company/modules/fm/types';

export interface CRMSummaryWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function CRMSummaryWidget({
    className,
    variant = 'default'
}: CRMSummaryWidgetProps) {
    const params = useParams();
    const companyId = params.id;

    const crmModule = useCrm();

    const [summary, setSummary] = useState<ClientsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [summaryRes] = await Promise.all([
                crmModule.getClientsSummary(params)
            ]);
            
            if (summaryRes.status) {
                setSummary(summaryRes.data);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка загрузки");
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Link href={`/platform/${companyId}/crm`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>клиентов</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && !error && (
                <>
                <div className={styles.title}>
                    CRM
                </div>
                <div className={styles.description}>Клиентская база</div>
                <div className={styles.counters}>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>
                                {summary?.active_clients || 0}
                            </div>
                        )}
                        <div className={styles.label}>Активных клиентов</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.new_clients || 0}</div>
                        )}
                        <div className={styles.label}>Новых клиентов</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.total_clients || 0}</div>
                        )}
                        <div className={styles.label}>Клиентов всего</div>
                    </div>
                </div>
                </>
            )}
        </Link>
    )
}