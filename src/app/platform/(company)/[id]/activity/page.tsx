'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { LogCard } from './components/log-card/log';
import clsx from 'clsx';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLogs } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { LogsResponse } from '@/apps/company/modules/logs/types';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import History from '@/assets/ui-kit/icons/history';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { Calendar } from './components/calendar/block';
import { DOCS_LINK_COMPANIES_LOGS } from '@/app/docs/(v1)/internal.config';
import Button from '@/assets/ui-kit/button/button';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const LOGS_OPTIMAL_STORAGE_PERIOD_DAYS = 30;
    const { showMessage } = useMessage();
    
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.LOGS)
    const ALLOW_ACTIVITY = usePermission(PERMISSIONS.LOGS_ACTIVITY)
    const ALLOW_OPTIMIZE = usePermission(PERMISSIONS.LOGS_OPTIMIZE)
    const ALLOW_CLEAR = usePermission(PERMISSIONS.LOGS_CLEAR)

    const logsModule = useLogs();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });
    
    const [data, setData] = useState<LogsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Modal states
    const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    
    const handleSearch = (searchValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (searchValue.trim()) {
            params.set('search', searchValue);
            params.set('page', '1');
        } else {
            params.delete('search');
        }
        
        router.push(`${pathname}?${params.toString()}`);
    };
    
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;

            const response = await logsModule.getLogs({
                page,
                limit,
                search
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

    const handleOptimize = async () => {
        setIsOptimizing(true);
        try {
            const response = await logsModule.optimize();
            if (response.status) {
                showMessage({
                    label: 'Логи оптимизированы',
                    variant: 'success'
                });
                setOptimizeModalOpen(false);
                loadData();
            } else {
                throw new Error(response.message || 'Ошибка оптимизации');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось оптимизировать логи',
                variant: 'error'
            });
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleClear = async () => {
        setIsClearing(true);
        try {
            const response = await logsModule.clear();
            if (response.status) {
                showMessage({
                    label: 'Логи очищены',
                    variant: 'success'
                });
                setClearModalOpen(false);
                loadData();
            } else {
                throw new Error(response.message || 'Ошибка очистки');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось очистить логи',
                variant: 'error'
            });
        } finally {
            setIsClearing(false);
        }
    };

    const pagination = data?.pagination;
    const logs = data?.logs || [];

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    if (loading || ALLOW_PAGE.isLoading) return <PlatformLoading />;
    if (error) return <PlatformError error={error} />;
    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return <PlatformNotAllowed permission={PERMISSIONS.LOGS} />;

    return (
        <>
            <PlatformHead 
                title='История действий'
                description='Активность сотрудников в системе.'
                docsEscort={{
                    href: DOCS_LINK_COMPANIES_LOGS,
                    title: 'Подробнее о мониторинге действий'
                }}
                searchProps={{
                    placeholder: 'Поиск по логам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch={true}
            >
                {(!ALLOW_ACTIVITY.isLoading && ALLOW_ACTIVITY.allowed) && (
                    <Calendar className={styles.calendar} />
                )}

                <div className={styles.actions}>
                    {(!ALLOW_OPTIMIZE.isLoading && ALLOW_OPTIMIZE.allowed) && (
                        <Button 
                            variant='accent'
                            children='Оптимизировать'
                            className={styles.action}
                            onClick={() => setOptimizeModalOpen(true)}
                        />
                    )}
                    {(!ALLOW_CLEAR.isLoading && ALLOW_CLEAR.allowed) && (
                        <Button 
                            variant='empty'
                            children='Очистить историю'
                            className={styles.action}
                            onClick={() => setClearModalOpen(true)}
                        />
                    )}
                </div>
            </PlatformHead>
            
            {logs.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Нет действий в организации.' 
                    icon={<History />} />
            ) : (
                <div className={styles.grid}>
                    {logs.map((log) => (
                        <LogCard className={styles.log} key={log.id} log={log} />
                    ))}
                </div>
            )}

            {pagination && pagination.pages > 1 && (
                <div className={styles.pagination}>
                    <PlatformPagination
                        meta={pagination}
                        baseUrl={pathname}
                        queryParams={queryParams}
                        onPageChange={(page) => handlePageChange(page)}
                    />
                </div>
            )}

            {/* Modal for Optimize */}
            <PlatformModal
                isOpen={optimizeModalOpen}
                onClose={() => setOptimizeModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Оптимизировать логи?'
                    description={`Логи, хранящиеся более ${LOGS_OPTIMAL_STORAGE_PERIOD_DAYS} дней, будут удалены. Это действие необратимо.`}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setOptimizeModalOpen(false),
                            disabled: isOptimizing
                        },
                        {
                            variant: 'accent',
                            onClick: handleOptimize,
                            children: isOptimizing ? 'Оптимизация...' : 'Оптимизировать',
                            disabled: isOptimizing
                        }
                    ]}
                />
            </PlatformModal>

            {/* Modal for Clear */}
            <PlatformModal
                isOpen={clearModalOpen}
                onClose={() => setClearModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Очистить историю?'
                    description='Все логи будут безвозвратно удалены. Это действие необратимо.'
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setClearModalOpen(false),
                            disabled: isClearing
                        },
                        {
                            variant: 'accent',
                            onClick: handleClear,
                            children: isClearing ? 'Очистка...' : 'Очистить',
                            disabled: isClearing
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}