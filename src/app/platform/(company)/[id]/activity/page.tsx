'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { LogCard } from './components/log-card/log';
import Copy from '@/assets/ui-kit/icons/copy';
import clsx from 'clsx';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useLogs } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { LogsResponse } from '@/apps/company/modules/logs/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const logsModule = useLogs();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [data, setData] = useState<LogsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');

            const response = await logsModule.getLogs({
                page,
                limit
            });

            if (response.status) {
                setData(response.data);
            } else {
                setError("Не удалось загрузить логи");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const pagination = data?.pagination;
    const logs = data?.logs || [];

    // Параметры для пагинации
    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;

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

    return (
        <>
            <PlatformHead 
                title='История действий'
                description='Активность сотрудников в системе.'
                actions={[
                    {
                        variant: 'accent',
                        children: 'Скопировать лог',
                        icon: <Copy />
                    }
                ]}
            >
                {/* <div className={styles.control}>
                    <span className={clsx(styles.tag, styles.accent)}>Все действия</span>
                    <span className={styles.tag}>Только критичные</span>
                </div> */}
            </PlatformHead>
            
            <div className={styles.grid}>
                {logs.length === 0 ? (
                    <div style={{
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: ".7em", 
                        color: "var(--color-text-description)", 
                        minHeight: "10rem",
                        width: "100%"
                    }}>
                        Нет записей
                    </div>
                ) : (
                    logs.map((log) => (
                        <LogCard className={styles.log} key={log.id} log={log} />
                    ))
                )}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className={styles.pagination}>
                    <PlatformPagination
                        meta={pagination}
                        baseUrl={pathname}
                        queryParams={queryParams}
                    />
                </div>
            )}
        </>
    );
}