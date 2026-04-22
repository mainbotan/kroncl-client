'use client';

import clsx from 'clsx';
import styles from './widget.module.scss';
import { Remained } from '@/assets/ui-kit/remained/remained';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStorage } from '@/apps/company/modules';
import { formatSize } from '@/assets/utils/size';
import { useCompany } from '@/apps/company/provider';

export interface StorageWidgetProps {
    className?: string;
    variant?: 'compact' | 'default';
}

export function StorageWidget({
    className,
    variant = 'default'
}: StorageWidgetProps) {
    const params = useParams();
    const companyId = params.id as string;
    const storage = useStorage();
    const companyContext = useCompany();
    
    const { data: sourcesData, isLoading: loading } = storage.useSources(companyId);
    const sources = sourcesData?.status ? sourcesData.data : null;
    
    const limitDbMb = companyContext.companyPlan?.current_plan.limit_db_mb || 0;
    const usedDbMb = sources?.total_size_mb || 0;
    const isExceedLimitDb = limitDbMb < usedDbMb;
    const usagePercent = (usedDbMb / limitDbMb) * 100;
    
    return (
        <Link href={`/platform/${companyId}/storage`} className={clsx(styles.widget, styles[variant], className)}>
            {variant === 'default' && (
                <>
                    <div className={styles.title}>
                        Использование хранилища
                    </div>
                    {isExceedLimitDb && (<div className={styles.exceed}>Превышение лимита</div>)}
                    <Remained value={usagePercent} limit={100} loading={loading}>
                        {loading ? '-- из -- ГБ' : `${formatSize(usedDbMb)} из ${formatSize(limitDbMb)}`}
                    </Remained>
                    <div className={styles.counters}>
                        <div className={styles.item}>
                            {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                                <div className={styles.value}>
                                    {sources?.total_size_mb.toFixed(0) || 0} <span className={styles.secondary}>МБ</span>
                                </div>
                            )}
                            <div className={styles.label}>Размер базы данных</div>
                        </div>
                        <div className={styles.item}>
                            {loading ? (<div className={clsx(styles.value, styles.loading)} />) : (
                                <div className={styles.value}>
                                    {sources?.total_rows.toLocaleString('ru-RU') || 0}
                                </div>
                            )}
                            <div className={styles.label}>Всего строк</div>
                        </div>
                    </div>
                    <span className={styles.mark} />
                </>
            )}
            {variant === 'compact' && (
                <>
                    {isExceedLimitDb && (<div className={styles.exceed}>Превышение лимита</div>)}
                    <Remained value={usagePercent} limit={100} loading={loading}>
                        {loading ? '-- из -- ГБ' : `Диск ${formatSize(usedDbMb)} из ${formatSize(limitDbMb)}`}
                    </Remained>
                </>
            )}
        </Link>
    );
}