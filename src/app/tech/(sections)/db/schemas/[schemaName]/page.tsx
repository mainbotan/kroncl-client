// app/tech/db/schemas/[schemaName]/page.tsx

'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import styles from './page.module.scss';
import { useParams, useRouter } from 'next/navigation';
import { SchemaStatsBlock } from '../../components/schema-stats/block';
import { useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_1 } from '@/apps/admin/auth/types';
import Arrow from '@/assets/ui-kit/icons/arrow';
import { TableCard } from '../../components/table-card/card';
import { SchemaTables } from '../../components/schema-tables/tables';

export default function SchemaPage() {
    const params = useParams();
    const router = useRouter();
    const schemaName = params.schemaName as string;
    
    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_1);

    if (adminLoading) return <PlatformLoading />;
    
    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    return (
        <>
            <PlatformHead
                title={schemaName}
                description="Схема инстанса."
            />
            <div className={styles.container}>
                <SchemaStatsBlock className={styles.stats} schemaName={schemaName} />
                <SchemaTables className={styles.tables} schemaName={schemaName} />
            </div>
        </>
    );
}