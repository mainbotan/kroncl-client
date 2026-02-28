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

export default function SourcesAnalysisPage() {
    const crmModule = useCrm();
    const searchParams = useSearchParams();

    const [sourcesData, setSourcesData] = useState<GroupedClientsStats[]>([]);
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

            const res = await crmModule.getGroupedClients({ 
                ...params,
                group_by: 'source'
            });

            if (res.status) {
                // Сортируем по убыванию количества клиентов
                const sorted = [...res.data].sort((a, b) => 
                    b.clients_count - a.clients_count
                );
                setSourcesData(sorted);
            }
        } catch (error) {
            console.error('Error loading sources analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.grid}>    
            <section className={clsx(styles.section, styles.graph)}>
                <SourcesChart data={sourcesData} loading={loading} />
            </section>
        </div>
    );
}