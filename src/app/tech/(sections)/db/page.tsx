'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import styles from './page.module.scss';
import { DbHistoryChart } from './components/history-chart/chart';
import { SummaryStatsBlock } from './components/summary-stats/block';
import Package from '@/assets/ui-kit/icons/package';
import { useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_1 } from '@/apps/admin/auth/types';

export default function Page() {
    const { allowed: isAdmin, isLoading } = useAdminLevel(ADMIN_LEVEL_1);

    if (isLoading) return <PlatformLoading />;
    
    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    return (
        <>
            <PlatformHead 
                title='База данных'
                description='Состояние инстанса, мониторинг нагрузки, схемы организаций.'
                actions={[
                    {
                        variant: 'light',
                        children: 'Схемы',
                        as: 'link',
                        href: '/tech/db/schemas',
                        icon: <Package />
                    }
                ]}
            />
            <div className={styles.grid}>
                <SummaryStatsBlock className={styles.summaryBlock} />
                <DbHistoryChart className={styles.loadChart} />
            </div>
        </>
    );
}