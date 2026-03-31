'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFm } from '@/apps/company/modules';
import { GetAnalysisParams } from '@/apps/company/modules/crm/types';
import { AnalysisSummary } from '@/apps/company/modules/fm/types';

export interface HRMSummaryWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function HRMSummaryWidget({
    className,
    variant = 'default'
}: HRMSummaryWidgetProps) {
    const params = useParams();
    const companyId = params.id;

    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
    };
    
    return (
        <Link href={`/platform/${companyId}/hrm`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>сотрудников</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && !error && (
                <>
                <div className={styles.title}>
                    Штат сотрудников
                </div>
                <div className={styles.description}>Управление персоналом</div>
                <div className={styles.counters}>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>
                                {summary?.net_balance || 0} &#8381;
                            </div>
                        )}
                        <div className={styles.label}>Активных сотрудников</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.transaction_count.toLocaleString('ru-RU') || 0}</div>
                        )}
                        <div className={styles.label}>Должностей</div>
                    </div>
                </div>
                </>
            )}
        </Link>
    )
}