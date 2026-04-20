'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useDm } from '@/apps/company/modules';
import { DealAnalysisSummary, DealTransactionsSummary, GroupedStats } from '@/apps/company/modules/dm/types';
import styles from './page.module.scss';
import { DailyChart } from '../components/daily-chart/chart';
import { IndicatorWidget } from '../../../fm/(main)/components/indicator-widget/widget';
import { toRFC3339 } from '@/assets/utils/date-formatter';
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import Chart from '@/assets/ui-kit/icons/chart';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';

export default function AnalysisPage() {
    const dmModule = useDm();
    const searchParams = useSearchParams();

    const [summary, setSummary] = useState<DealAnalysisSummary | null>(null);
    const [financialSummary, setFinancialSummary] = useState<DealTransactionsSummary | null>(null);
    const [dailyData, setDailyData] = useState<GroupedStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const urlStartDate = searchParams.get('start_date');
            const urlEndDate = searchParams.get('end_date');
            
            const params: { start_date?: string; end_date?: string } = {};
            if (urlStartDate) params.start_date = toRFC3339(urlStartDate);
            if (urlEndDate) params.end_date = toRFC3339(urlEndDate);

            const [summaryRes, dailyRes, financialRes] = await Promise.all([
                dmModule.getAnalysisSummary(params),
                dmModule.getAnalysisGrouped({
                    ...params,
                    group_by: 'day'
                }),
                dmModule.getFinancialSummary(params)
            ]);

            if (summaryRes.status) {
                setSummary(summaryRes.data);
            }
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
            if (financialRes.status) {
                setFinancialSummary(financialRes.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading analysis:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number): string => {
        return value.toLocaleString('ru-RU');
    };

    if (loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    const hasData = summary && summary.total_deals > 0;

    if (!hasData) {
        return (
            <PlatformEmptyCanvas 
                title='Нет данных за выбранный период.'
                icon={<Chart />}
            />
        );
    }

    return (
        <div className={styles.grid}>    
            <section className={clsx(styles.section, styles.counters)}>
            {financialSummary && (
                <>
                    <IndicatorWidget
                        value={{
                            amount: financialSummary.total_amount,
                            unit: '₽',
                        }}
                        legend='Финансовый итог'
                        about='Сумма всех доходов и расходов по сделкам'
                        variant='accent'
                        className={styles.indicator}
                        loading={loading}
                    />
                    <IndicatorWidget
                        value={{
                            amount: financialSummary.income_amount,
                            unit: '₽',
                        }}
                        legend='Доходы'
                        about='Сумма доходных операций'
                        size='sm'
                        className={styles.indicator}
                        loading={loading}
                    />
                    <IndicatorWidget
                        value={{
                            amount: financialSummary.expense_amount,
                            unit: '₽',
                        }}
                        legend='Расходы'
                        about='Сумма расходных операций'
                        size='sm'
                        className={styles.indicator}
                        loading={loading}
                    />
                    <IndicatorWidget
                        value={{
                            amount: financialSummary.total_count,
                        }}
                        legend='Всего операций'
                        about='Общее количество финансовых операций'
                        size='sm'
                        className={styles.indicator}
                        loading={loading}
                    />
                </>
            )}
            
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.total_deals,
                    } : undefined}
                    legend='Всего сделок'
                    about='Общее количество сделок в системе'
                    variant='accent'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.deals_in_default,
                    } : undefined}
                    legend='В начальном статусе'
                    about={summary?.default_status_name ? `Сделки в статусе «${summary.default_status_name}»` : 'Сделки в начальном статусе'}
                    size='sm'
                    variant='accent'
                    className={styles.indicator}
                    loading={loading}
                />
            </section>

            <section className={clsx(styles.section, styles.graph)}>
                <DailyChart data={dailyData} loading={loading} />
            </section>
        </div>
    );
}