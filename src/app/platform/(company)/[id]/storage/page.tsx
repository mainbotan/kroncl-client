'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useStorage } from "@/apps/company/modules";
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { DOCS_LINK_COMPANIES_STORAGE } from "@/app/docs/(v1)/internal.config";
import { useCompany } from "@/apps/company/provider";
import { Remained } from "@/assets/ui-kit/remained/remained";
import clsx from "clsx";
import { StorageSources } from "@/apps/company/modules/storage/types";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function StoragePage() {
    const params = useParams();
    const companyId = params.id as string;

    const ALLOW_PAGE = usePermission(PERMISSIONS.STORAGE_SOURCES);
    const storage = useStorage();
    const companyContext = useCompany();
    
    const [data, setData] = useState<StorageSources | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await storage.getSources();
            if (response.status) {
                setData(response.data);
            } else {
                setError(response.message || 'Ошибка загрузки');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            console.error('Error loading storage sources:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (value: number, unit: 'MB' | 'GB' | 'TB'): string => {
        return value.toFixed(2);
    };

    const getSizeUnit = (limitMb: number): { value: number; unit: 'MB' | 'GB' | 'TB'; label: string } => {
        if (limitMb >= 1024 * 1024) {
            return { value: limitMb / (1024 * 1024), unit: 'TB', label: 'ТБ' };
        }
        if (limitMb >= 1024) {
            return { value: limitMb / 1024, unit: 'GB', label: 'ГБ' };
        }
        return { value: limitMb, unit: 'MB', label: 'МБ' };
    };
    
    if (loading || ALLOW_PAGE.isLoading) {
        return <PlatformLoading />;
    }

    if (error) {
        return <PlatformError error={error} />;
    }

    if (!ALLOW_PAGE.allowed) {
        return <PlatformNotAllowed permission={PERMISSIONS.STORAGE_SOURCES} />;
    }
    
    const limitDbMb = companyContext.companyPlan?.current_plan.limit_db_mb || 0;
    const usedMb = data?.total_size_mb || 0;
    
    const limitSize = getSizeUnit(limitDbMb);
    const usedSize = limitDbMb >= 1024 * 1024 ? usedMb / (1024 * 1024) 
        : limitDbMb >= 1024 ? usedMb / 1024 
        : usedMb;
    
    const usagePercent = limitDbMb > 0 ? (usedMb / limitDbMb) * 100 : 0;
    
    return (
        <>
            <PlatformHead
                title='Ресурсы хранилища'
                description="Системная информация о ресурсах хранилища организации."
                docsEscort={{
                    href: DOCS_LINK_COMPANIES_STORAGE,
                    title: 'Подробнее о хранилище организации'
                }}
            />
            <div className={styles.grid}>
                {limitDbMb > 0 && (
                    <Remained 
                        className={styles.remained} 
                        value={usagePercent} 
                        limit={100}
                    >
                        {formatSize(usedSize, limitSize.unit)} {limitSize.label} из {formatSize(limitSize.value, limitSize.unit)} {limitSize.label}{' '}
                        <Link href={`/platform/${companyId}/pricing`} className={styles.hint}>лимит текущего тарифа</Link>
                    </Remained>
                )}
                
                <div className={styles.counters}>
                    <section className={clsx(styles.item, styles.lg)}>
                        <div className={styles.value}>
                            {data?.total_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>Общий размер базы данных</div>
                    </section>
                    <section className={clsx(styles.item)}>
                        <div className={styles.value}>
                            {data?.table_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>Данные таблиц</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.index_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>Индексы</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.toast_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>TOAST</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.total_rows.toLocaleString('ru-RU')}
                        </div>
                        <div className={styles.label}>Всего строк</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.dead_rows.toLocaleString('ru-RU')}
                        </div>
                        <div className={styles.label}>Мёртвых строк</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.table_count}
                        </div>
                        <div className={styles.label}>Таблиц</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.index_count}
                        </div>
                        <div className={styles.label}>Индексов</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {data?.active_connections}
                        </div>
                        <div className={styles.label}>Активных соединений</div>
                    </section>
                </div>
            </div>
        </>
    );
}