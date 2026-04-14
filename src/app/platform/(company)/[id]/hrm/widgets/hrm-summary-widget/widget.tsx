'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useHrm } from '@/apps/company/modules';
import { EmployeesSummary } from '@/apps/company/modules/hrm/types';

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
    const hrmModule = useHrm();

    const [summary, setSummary] = useState<EmployeesSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const summaryRes = await hrmModule.getAnalysisSummary();
            
            if (summaryRes.status) {
                setSummary(summaryRes.data);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка загрузки");
            console.error('Error loading HRM summary:', error);
        } finally {
            setLoading(false);
        }
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
                                {summary?.active_employees.toLocaleString('ru-RU') || 0}
                            </div>
                        )}
                        <div className={styles.label}>Активных сотрудников</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.total_positions.toLocaleString('ru-RU') || 0}</div>
                        )}
                        <div className={styles.label}>Должностей</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.total_employees.toLocaleString('ru-RU') || 0}</div>
                        )}
                        <div className={styles.label}>Всего сотрудников</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>{summary?.new_employees.toLocaleString('ru-RU') || 0}</div>
                        )}
                        <div className={styles.label}>Новых за период</div>
                    </div>
                </div>
                </>
            )}
        </Link>
    )
}