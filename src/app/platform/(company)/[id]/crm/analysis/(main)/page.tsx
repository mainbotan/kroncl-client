'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useCrm } from '@/apps/company/modules';
import { ClientsSummary, GroupedClientsStats } from '@/apps/company/modules/crm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './page.module.scss';
import { DailyChart } from '../components/daily-chart/chart';
import { IndicatorWidget } from '../../../fm/(main)/components/indicator-widget/widget';
import { toRFC3339 } from '@/assets/utils/date-formatter';

export default function AnalysisPage() {
    const crmModule = useCrm();
    const searchParams = useSearchParams();

    const [summary, setSummary] = useState<ClientsSummary | null>(null);
    const [dailyData, setDailyData] = useState<GroupedClientsStats[]>([]);
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
                crmModule.getClientsSummary(params),
                crmModule.getGroupedClients({
                    ...params,
                    group_by: 'day'
                })
            ]);

            if (summaryRes.status) {
                setSummary(summaryRes.data);
            }
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
                        amount: summary.total_clients,
                    } : undefined}
                    legend='Всего клиентов'
                    about='Общее количество клиентов в базе'
                    variant='accent'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.new_clients,
                    } : undefined}
                    legend='Новые за период'
                    about='Клиенты, созданные за выбранный период'
                    size='sm'
                    variant='accent'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.active_clients,
                    } : undefined}
                    legend='Активные'
                    about='Клиенты со статусом "активен"'
                    size='sm'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.inactive_clients,
                    } : undefined}
                    legend='Неактивные'
                    about='Клиенты со статусом "неактивен"'
                    size='sm'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.individual_clients,
                    } : undefined}
                    legend='Физлица'
                    about='Клиенты - физические лица'
                    size='sm'
                    className={styles.indicator}
                    loading={loading}
                />
                <IndicatorWidget
                    value={summary ? {
                        amount: summary.legal_clients,
                    } : undefined}
                    legend='Юрлица'
                    about='Клиенты - юридические лица'
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