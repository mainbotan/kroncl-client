'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { adminDbApi } from '@/apps/admin/db/api';
import { SchemaListItem, GetSchemasResponse } from '@/apps/admin/db/types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { SchemaCard } from '../components/schema-card/card';
import Plus from '@/assets/ui-kit/icons/plus';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_1, ADMIN_MAX_LEVEL } from '@/apps/admin/auth/types';
import { AdminKeywordModal } from '@/app/tech/components/keyword-modal/modal';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export default function SchemasPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showMessage } = useMessage();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_1);
    const ALLOW_MIGRATE_ALL = useAdminLevel(ADMIN_MAX_LEVEL);
    const [data, setData] = useState<GetSchemasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
    const [isMigrating, setIsMigrating] = useState(false);

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

    const handleOnlyTenantsChange = (onlyTenants: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('only_tenants', String(onlyTenants));
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleMigrateAll = async (keyword: string) => {
        setIsMigrating(true);
        try {
            const response = await adminDbApi.migrateAllTenants(keyword);
            if (response.status) {
                showMessage({
                    label: 'Миграция всех тенантов выполнена успешно',
                    variant: 'success'
                });
                // Обновляем страницу
                router.refresh();
                // Перезагружаем список схем
                await loadSchemas();
            } else {
                showMessage({
                    label: response.message || 'Ошибка при миграции',
                    variant: 'error'
                });
            }
        } catch (err: any) {
            showMessage({
                label: err.message || 'Ошибка при миграции',
                variant: 'error'
            });
        } finally {
            setIsMigrating(false);
            setIsMigrateModalOpen(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) return;
        loadSchemas();
    }, [searchParams, isAdmin]);

    const loadSchemas = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;
            const onlyTenants = searchParams.get('only_tenants') === 'true';

            const response = await adminDbApi.getSchemas({
                page,
                limit,
                search,
                only_tenants: onlyTenants,
            });
            
            if (response.status && response.data) {
                setData(response.data);
            } else {
                setError('Не удалось загрузить список схем');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading schemas:', err);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    const schemas = data?.schemas || [];
    const pagination = data?.pagination;
    const onlyTenants = searchParams.get('only_tenants') === 'true';

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    if (onlyTenants) queryParams.only_tenants = 'true';

    return (
        <>
            <PlatformHead
                title='Схемы'
                description='Просмотр созданных схем инстанса.'
                searchProps={{
                    placeholder: 'Поиск по названию схемы',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                actions={isAdminAllowed(ALLOW_MIGRATE_ALL) ? [
                    {
                        children: 'Поднять все',
                        variant: 'light',
                        onClick: () => setIsMigrateModalOpen(true)
                    }
                ]: undefined}
                showSearch
            />
            {schemas.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Схемы не найдены'
                    description={searchParams.get('search') ? 'Попробуйте изменить поисковый запрос' : 'База данных пуста'}
                />
            ) : (
                <>
                    <div className={styles.container}>
                        {schemas.map((schema: SchemaListItem) => (
                            <SchemaCard 
                                key={schema.schema_name} 
                                schema={schema} 
                                className={styles.item} 
                            />
                        ))}
                    </div>
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
                </>
            )}

            <AdminKeywordModal
                isOpen={isMigrateModalOpen}
                onClose={() => setIsMigrateModalOpen(false)}
                onConfirm={handleMigrateAll}
                title="Миграция всех тенантов"
                description="Это действие применит все миграции ко всем схемам организаций. Операция может занять некоторое время и повлиять на работу системы."
                actionName="Мигрировать"
                isLoading={isMigrating}
            />
        </>
    );
}