'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useStorage } from "@/apps/company/modules";
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { DOCS_LINK_COMPANIES_STORAGE } from "@/app/docs/(v1)/internal.config";
import { useCompany } from "@/apps/company/provider";
import { Remained } from "@/assets/ui-kit/remained/remained";
import clsx from "clsx";
import { StorageSources, StorageModulesData } from "@/apps/company/modules/storage/types";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/assets/ui-kit/button/button";
import { ModulesChart } from "./components/modules-chart/chart";

export default function StoragePage() {
    const params = useParams();
    const companyId = params.id as string;

    const ALLOW_PAGE = usePermission(PERMISSIONS.STORAGE_SOURCES);
    const storage = useStorage();
    const companyContext = useCompany();
    
    const [sources, setSources] = useState<StorageSources | null>(null);
    const [modules, setModules] = useState<StorageModulesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [sourcesRes, modulesRes] = await Promise.all([
                storage.getSources(),
                storage.getSourcesByModules()
            ]);
            
            if (sourcesRes.status) {
                setSources(sourcesRes.data);
            } else {
                setError(sourcesRes.message || 'Ошибка загрузки');
                return;
            }
            
            if (modulesRes.status) {
                setModules(modulesRes.data);
            } else {
                setError(modulesRes.message || 'Ошибка загрузки аналитики');
                return;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            console.error('Error loading storage data:', err);
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

    if (!isAllowed(ALLOW_PAGE)) {
        return <PlatformNotAllowed permission={PERMISSIONS.STORAGE_SOURCES} />;
    }
    
    const limitDbMb = companyContext.companyPlan?.current_plan.limit_db_mb || 0;
    const usedDbMb = sources?.total_size_mb || 0;
    const isExceedLimitDb = limitDbMb < usedDbMb;
    
    const limitDbSize = getSizeUnit(limitDbMb);
    const usedDbSize = limitDbMb >= 1024 * 1024 ? usedDbMb / (1024 * 1024) 
        : limitDbMb >= 1024 ? usedDbMb / 1024 
        : usedDbMb;
    
    const usagePercent = limitDbMb > 0 ? (usedDbMb / limitDbMb) * 100 : 0;
    
    const modulesList = modules?.modules ? Object.values(modules.modules) : [];
    
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
                <div className={styles.head}>
                    <div className={styles.title}>Данные</div>
                    <div className={styles.description}>Хранилище данных (база данных организации) используется для хранения текстовых данных модулей.</div>
                </div>
                {limitDbMb > 0 && (
                    <Remained 
                        className={styles.remained} 
                        value={usagePercent} 
                        limit={100}
                    >
                        {formatSize(usedDbSize, limitDbSize.unit)} {limitDbSize.label} из {formatSize(limitDbSize.value, limitDbSize.unit)} {limitDbSize.label}{' '}
                        <Link href={`/platform/${companyId}/pricing`} className={styles.hint}>лимит текущего тарифа</Link>
                    </Remained>
                )}

                {isExceedLimitDb && (
                    <div className={styles.exceed}>
                        <div className={styles.info}>
                            <div className={styles.title}>Превышение лимита</div>
                            <div className={styles.description}>Превышение лимита хранилища данных организации. Для предотвращения блокировки организации рекомендуем выполнить одно из предложенных действий.</div>
                            <Link href={`/platform/${companyId}/activity`} className={styles.item}>Оптимизируйте логи действий</Link>
                            <Link href={`/platform/${companyId}/pricing`} className={styles.item}>Улучшите тарифный план</Link>
                        </div>
                        <div className={styles.actions}>
                            <Button
                                href={`/platform/${companyId}/pricing`}
                                as='link'
                                variant="accent" 
                                children='Сменить тариф'
                                className={styles.action} />
                        </div>
                    </div>
                )}
                
                <div className={styles.counters}>
                    <section className={clsx(styles.item, styles.lg)}>
                        <div className={styles.value}>
                            {sources?.total_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>Общий размер базы данных</div>
                    </section>
                    <section className={clsx(styles.item)}>
                        <div className={styles.value}>
                            {sources?.table_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>Данные таблиц</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.index_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>Индексы</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.toast_size_mb.toFixed(2)} <span className={styles.secondary}>МБ</span>
                        </div>
                        <div className={styles.label}>TOAST</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.total_rows.toLocaleString('ru-RU')}
                        </div>
                        <div className={styles.label}>Всего строк</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.dead_rows.toLocaleString('ru-RU')}
                        </div>
                        <div className={styles.label}>Мёртвых строк</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.table_count}
                        </div>
                        <div className={styles.label}>Таблиц</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.index_count}
                        </div>
                        <div className={styles.label}>Индексов</div>
                    </section>
                    <section className={styles.item}>
                        <div className={styles.value}>
                            {sources?.active_connections}
                        </div>
                        <div className={styles.label}>Активных соединений</div>
                    </section>
                </div>

                <div className={styles.head}>
                    <div className={styles.title}>Использование хранилища данных по модулям</div>
                    <div className={styles.description}>Распределение хранилища между модулями платформы.</div>
                </div>

                <div className={styles.chart}>
                    <div className={styles.container}>
                        <ModulesChart modules={modulesList} />
                    </div>
                </div>
            </div>
        </>
    );
}