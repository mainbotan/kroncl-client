'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDm } from '@/apps/company/modules';
import { DealAnalysisSummary, DealTransactionsSummary } from '@/apps/company/modules/dm/types';

export interface DMSummaryWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function DMSummaryWidget({
    className,
    variant = 'default'
}: DMSummaryWidgetProps) {
    const params = useParams();
    const companyId = params.id;

    const dmModule = useDm();

    const [summary, setSummary] = useState<DealAnalysisSummary | null>(null);
    const [financialSummary, setFinancialSummary] = useState<DealTransactionsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [summaryRes, financialRes] = await Promise.all([
                dmModule.getAnalysisSummary(),
                dmModule.getFinancialSummary()
            ]);
            
            if (summaryRes.status) {
                setSummary(summaryRes.data);
            }
            if (financialRes.status) {
                setFinancialSummary(financialRes.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading DM summary:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('ru-RU');
    };
    
    return (
        <Link href={`/platform/${companyId}/dm`} className={clsx(styles.widget, styles[variant], className, loading && styles.loading)}>
            {error && (
                <div className={styles.error}>
                    С виджетом <span className={styles.accent}>сделок</span> что-то пошло не так...
                </div>
            )}
            {variant === 'default' && !error && (
                <>
                <div className={styles.title}>
                    Сделки
                </div>
                <div className={styles.description}>Управление заказами</div>
                <div className={styles.counters}>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>
                                {summary?.total_deals || 0}
                            </div>
                        )}
                        <div className={styles.label}>Всего сделок</div>
                    </div>
                    <div className={styles.item}>
                        {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                            <div className={styles.value}>
                                {summary?.deals_in_default || 0}
                            </div>
                        )}
                        <div className={styles.label}>В начальном статусе</div>
                    </div>
                    {financialSummary && (
                        <>
                        <div className={styles.item}>
                            {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                                <div className={styles.value}>
                                    {formatCurrency(financialSummary.total_amount)} ₽
                                </div>
                            )}
                            <div className={styles.label}>Финансовый итог</div>
                        </div>
                        <div className={styles.item}>
                            {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                                <div className={styles.value}>
                                    {formatCurrency(financialSummary.income_amount)} ₽
                                </div>
                            )}
                            <div className={styles.label}>Доходы</div>
                        </div>
                        </>
                    )}
                </div>
                </>
            )}
        </Link>
    )
}