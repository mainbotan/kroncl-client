'use client';

import styles from './page.module.scss';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useDm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { GroupedStats } from '@/apps/company/modules/dm/types';
import { toRFC3339 } from '@/assets/utils/date-formatter';
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import Chart from '@/assets/ui-kit/icons/chart';
import { GroupedChart } from '../components/grouped-chart/chart';

export default function Page() {
    const dmModule = useDm();
    const searchParams = useSearchParams();

    const [groupedData, setEmployeesData] = useState<GroupedStats[]>([]);
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

            const response = await dmModule.getAnalysisGrouped({
                ...params,
                group_by: 'employee'
            });
            
            if (response.status) {
                if (response.data && response.data.length > 0) {
                    setEmployeesData(response.data);
                } else {
                    setEmployeesData([]);
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading employee analysis:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    const hasData = groupedData.length > 0;

    if (!hasData) {
        return (
            <PlatformEmptyCanvas 
                title='Нет данных по сотрудникам за выбранный период.'
                icon={<Chart />}
            />
        );
    }

    return (
        <div className={styles.grid}>
            <section className={clsx(styles.section, styles.graph)}>
                <GroupedChart data={groupedData} loading={loading} />
            </section>
        </div>
    );
}