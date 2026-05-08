'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import styles from './page.module.scss';
import Package from '@/assets/ui-kit/icons/package';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_1 } from '@/apps/admin/auth/types';
import { ServerStatsBlock } from './components/summary-stats/block';
import { ServerHistoryChart } from './components/history-chart/chart';

export default function Page() {
    const ALLOW_PAGE = useAdminLevel(ADMIN_LEVEL_1);

    if (ALLOW_PAGE.isLoading) return <PlatformLoading />;
    
    if (!isAdminAllowed(ALLOW_PAGE)) return <PlatformError error="Доступ запрещён" />;

    return (
        <>
            <PlatformHead 
                title='Сервер'
                description='Состояние сервера, нагрузочные метрики, горутины, использование памяти.'
            />
            <div className={styles.grid}>
                <ServerStatsBlock className={styles.summaryBlock} />
                <ServerHistoryChart className={styles.historyBlock} />
            </div>
        </>
    );
}