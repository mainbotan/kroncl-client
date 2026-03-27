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
import { EmployeesChart } from '../components/employees-chart/chart';
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";

export default function Page() {
    const fmModule = useFm();
    const searchParams = useSearchParams();

    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [employeesData, setEmployeesData] = useState<GroupedStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params: { start_date?: string; end_date?: string } = {};
            const urlStartDate = searchParams.get('start_date');
            const urlEndDate = searchParams.get('end_date');
            
            if (urlStartDate) params.start_date = toRFC3339(urlStartDate);
            if (urlEndDate) params.end_date = toRFC3339(urlEndDate);

            const [summaryRes, employeesRes] = await Promise.all([
                fmModule.getAnalysisSummary(params),
                fmModule.getGroupedAnalysis({
                    ...params,
                    group_by: 'employee'
                } as GetAnalysisParams & { group_by: 'employee' })
            ]);
            
            if (summaryRes.status) {
                setSummary(summaryRes.data);
            }
            
            if (employeesRes.status) {
                // Проверяем, есть ли данные и не пустые ли они
                if (employeesRes.data && employeesRes.data.length > 0) {
                    setEmployeesData(employeesRes.data);
                } else {
                    setEmployeesData([]);
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка загрузки");
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            <Spinner />
        </div>
    );
    
    if (error) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            {error}
        </div>
    );

    // Проверяем, есть ли данные для отображения
    const hasData = employeesData.length > 0;

    if (!hasData) {
        return (
            <PlatformEmptyCanvas 
                title='Нет данных по сотрудникам за выбранный период.'
                icon={<Wallet />}
            />
        );
    }

    return (
        <div className={styles.grid}>    
            {/* <section className={clsx(styles.section, styles.counters)}>
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
            </section> */}
            <section className={clsx(styles.section, styles.graph)}>
                <EmployeesChart data={employeesData} loading={loading} />
            </section>
        </div>
    );
}