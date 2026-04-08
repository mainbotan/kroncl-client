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
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import History from '@/assets/ui-kit/icons/history';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { Calendar } from './components/calendar/block';
import EyeOff from '@/assets/ui-kit/icons/eye-off';
import { DOCS_LINK_COMPANIES_LOGS } from '@/app/docs/(v1)/internal.config';
import Button from '@/assets/ui-kit/button/button';
import Upload from '@/assets/ui-kit/icons/upload';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.LOGS, {allowExpired: true})
    
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

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.LOGS} />
    )

    return (
        <>
            <PlatformHead 
                title='История действий'
                description='Активность сотрудников в системе.'
                docsEscort={{
                    href: DOCS_LINK_COMPANIES_LOGS,
                    title: 'Подробнее о мониторинге действий'
                }}
                showSearch={true}
            >
                {/** Activity calendar */}
                <Calendar className={styles.calendar} />

                <div className={styles.actions}>
                    <Button 
                        variant='accent'
                        icon={<Upload />}
                        children='Экспорт'
                        className={styles.action} />
                    <Button 
                        variant='empty'
                        icon={<EyeOff />}
                        children='Скрыть календарь'
                        className={styles.action} />
                    <Button 
                        variant='empty'
                        children='Очистить историю'
                        className={styles.action} />
                </div>
            </PlatformHead>
            
            <div className={styles.grid}>
                {logs.length === 0 ? (
                    <PlatformEmptyCanvas
                        title='Нет действий в организации.' 
                        icon={<History />} />
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