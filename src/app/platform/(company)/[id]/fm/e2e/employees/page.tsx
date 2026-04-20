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
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';

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
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
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
            <section className={clsx(styles.section, styles.graph)}>
                <EmployeesChart data={employeesData} loading={loading} />
            </section>
        </div>
    );
}