'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFm } from '@/apps/company/modules';
import { GetAnalysisParams } from '@/apps/company/modules/crm/types';
import { AnalysisSummary } from '@/apps/company/modules/fm/types';

export interface FMSummaryWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function FMSummaryWidget({
    className,
    variant = 'default'
}: FMSummaryWidgetProps) {
    const params = useParams();
    const companyId = params.id;
    const fmModule = useFm();

    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
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
                fmModule.getAnalysisSummary(params)
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
        <Link href={`/platform/${companyId}/fm`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>финансов</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && (
                <>
                <div className={styles.title}>
                    Финансы организации
                </div>
                <div className={styles.description}>Управление финансами</div>
                <div className={styles.counters}>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>
                                {summary?.net_balance.toLocaleString('ru-RU') || 0} &#8381;
                            </div>
                        )}
                        <div className={styles.label}>Баланс организации</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.transaction_count.toLocaleString('ru-RU') || 0}</div>
                        )}
                        <div className={styles.label}>Операций за всё время</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.total_expense.toLocaleString('ru-RU') || 0} &#8381;</div>
                        )}
                        <div className={styles.label}>Расходы</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.total_income.toLocaleString('ru-RU') || 0} &#8381;</div>
                        )}
                        <div className={styles.label}>Доходы</div>
                    </div>
                </div>
                </>
            )}
        </Link>
    )
}