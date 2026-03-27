'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useCrm } from '@/apps/company/modules';
import { GroupedClientsStats } from '@/apps/company/modules/crm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './page.module.scss';
import { SourcesChart } from '../components/sources-chart/chart';
import { toRFC3339 } from '@/assets/utils/date-formatter';
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import Clients from "@/assets/ui-kit/icons/clients";
import Chart from '@/assets/ui-kit/icons/chart';

export default function SourcesAnalysisPage() {
    const crmModule = useCrm();
    const searchParams = useSearchParams();

    const [sourcesData, setSourcesData] = useState<GroupedClientsStats[]>([]);
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

            const res = await crmModule.getGroupedClients({ 
                ...params,
                group_by: 'source'
            });

            if (res.status) {
                // Проверяем, есть ли данные и не пустые ли они
                if (res.data && res.data.length > 0) {
                    // Сортируем по убыванию количества клиентов
                    const sorted = [...res.data].sort((a, b) => 
                        b.clients_count - a.clients_count
                    );
                    setSourcesData(sorted);
                } else {
                    setSourcesData([]);
                }
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : "Ошибка загрузки");
            console.error('Error loading sources analysis:', error);
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
    const hasData = sourcesData.length > 0;

    if (!hasData) {
        return (
            <PlatformEmptyCanvas 
                title='Нет данных по источникам за выбранный период.'
                icon={<Chart />}
            />
        );
    }

    return (
        <div className={styles.grid}>    
            <section className={clsx(styles.section, styles.graph)}>
                <SourcesChart data={sourcesData} loading={loading} />
            </section>
        </div>
    );
}