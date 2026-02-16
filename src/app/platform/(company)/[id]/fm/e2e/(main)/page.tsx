'use client';

import styles from './page.module.scss';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { IndicatorWidget } from '../../(main)/components/indicator-widget/widget';
import Wallet from '@/assets/ui-kit/icons/wallet';
import { useFm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { AnalysisSummary, GetAnalysisParams, GroupedStats } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { toRFC3339 } from '@/assets/utils/date-formatter';
import { DailyChart } from '../components/daily-chart/chart';

export default function Page() {
    const fmModule = useFm();
    const searchParams = useSearchParams();

    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [dailyData, setDailyData] = useState<GroupedStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params: { start_date?: string; end_date?: string } = {};
            const urlStartDate = searchParams.get('start_date');
            const urlEndDate = searchParams.get('end_date');
            
            if (urlStartDate) params.start_date = toRFC3339(urlStartDate);
            if (urlEndDate) params.end_date = toRFC3339(urlEndDate);

            const [summaryRes, dailyRes] = await Promise.all([
                fmModule.getAnalysisSummary(params),
                fmModule.getGroupedAnalysis({
                    ...params,
                    group_by: 'day'
                } as GetAnalysisParams & { group_by: 'day' })
            ]);
            
            if (summaryRes.status) setSummary(summaryRes.data);
            if (dailyRes.status) {
                // Сортируем по дате (от старых к новым)
                const sorted = [...dailyRes.data].sort((a, b) => 
                    a.group_key.localeCompare(b.group_key)
                );
                setDailyData(sorted);
            }
        } catch (error) {
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.grid}>    
            <section className={clsx(styles.section, styles.counters)}>
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.net_balance,
                        unit: '₽',
                        icon: <Wallet />
                    } : undefined}
                    legend='Баланс к концу периода'
                    about='Сведённый баланс за выбранный период'
                    variant='accent'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.total_income,
                        unit: '₽'
                    } : undefined}
                    legend='Доходы'
                    about='Общая сумма доходов за период'
                    size='sm'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.total_expense,
                        unit: '₽',
                    } : undefined}
                    legend='Расходы'
                    about='Общая сумма расходов за период'
                    size='sm'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.transaction_count,
                    } : undefined}
                    legend='Операций'
                    about='Количество операций за период'
                    size='sm'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: Math.round(summary.avg_transaction),
                        unit: '₽'
                    } : undefined}
                    legend='Средний чек за период'
                    about='Средняя сумма операции'
                    size='sm'
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