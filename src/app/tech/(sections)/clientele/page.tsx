'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import styles from './page.module.scss';
import Package from '@/assets/ui-kit/icons/package';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_1, ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';
import { ClienteleStatsBlock } from './components/summary-stats/block';
import { ClienteleHistoryChart } from './components/history-chart/chart';

export default function Page() {
    const ALLOW_PAGE = useAdminLevel(ADMIN_LEVEL_4);

    if (ALLOW_PAGE.isLoading) return <PlatformLoading />;
    
    if (!isAdminAllowed(ALLOW_PAGE)) return <PlatformError error="Доступ запрещён" />;

    return (
        <>
            <PlatformHead 
                title='Клиентура'
                description='Аккаунты, организации и платежи в одной воронке.'
            />
            <div className={styles.grid}>
                <ClienteleStatsBlock className={styles.summaryBlock} />
                <ClienteleHistoryChart className={styles.historyBlock} />
            </div>
        </>
    );
}