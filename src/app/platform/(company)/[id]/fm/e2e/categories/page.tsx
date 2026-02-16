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
import { CategoriesChart } from '../components/categories-chart/chart';

export default function Page() {
    const fmModule = useFm();
    const searchParams = useSearchParams();

    const [summary, setSummary] = useState<AnalysisSummary | null>(null);
    const [categoriesData, setCategoriesData] = useState<GroupedStats[]>([]);
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

            const [summaryRes, categoriesRes] = await Promise.all([
                fmModule.getAnalysisSummary(params),
                fmModule.getGroupedAnalysis({
                    ...params,
                    group_by: 'category'
                } as GetAnalysisParams & { group_by: 'category' })
            ]);
            
            if (summaryRes.status) setSummary(summaryRes.data);
            if (categoriesRes.status) {
                setCategoriesData(categoriesRes.data);
            }
        } catch (error) {
            console.error('Error loading analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.grid}>    
            <section className={clsx(styles.section, styles.graph)}>
                <CategoriesChart data={categoriesData} loading={loading} />
            </section>
        </div>
    );
}