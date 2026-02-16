'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import Input from '@/assets/ui-kit/input/input';
import Button from '@/assets/ui-kit/button/button';
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { IndicatorWidget } from '../(main)/components/indicator-widget/widget';
import Wallet from '@/assets/ui-kit/icons/wallet';
import { useFm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { AnalysisSummary, GetAnalysisParams, GroupedStats } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { toRFC3339 } from '@/assets/utils/date-formatter';
import { DailyChart } from './components/daily-chart/chart';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const fmModule = useFm();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [dailyData, setDailyData] = useState<GroupedStats[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Локальное состояние для полей ввода
    const [localStartDate, setLocalStartDate] = useState(searchParams.get('start_date') || '');
    const [localEndDate, setLocalEndDate] = useState(searchParams.get('end_date') || '');

    useEffect(() => {
        loadData();
    }, [searchParams]);

    // Синхронизируем локальное состояние при изменении URL
    useEffect(() => {
        setLocalStartDate(searchParams.get('start_date') || '');
        setLocalEndDate(searchParams.get('end_date') || '');
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

    const handleApply = () => {
        const params = new URLSearchParams();
        if (localStartDate) params.set('start_date', localStartDate);
        if (localEndDate) params.set('end_date', localEndDate);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <>
        <PlatformHead 
            title='Анализ финансов'
            description='Распределение расходов/доходов по категориям и сотрудникам за выбранный промежуток времени.'
        >
            <div className={styles.control}>
                <Input 
                    className={styles.input} 
                    type='date' 
                    placeholder='Начало анализа' 
                    value={localStartDate}
                    onChange={(e) => setLocalStartDate(e.target.value)}
                />
                <Input 
                    className={styles.input} 
                    type='date' 
                    placeholder='Конец периода'
                    value={localEndDate}
                    onChange={(e) => setLocalEndDate(e.target.value)}
                />
                <Button className={styles.action} variant='accent' onClick={handleApply}>
                    Применить
                </Button>
            </div>    
        </PlatformHead>

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
        </>
    );
}