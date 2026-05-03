// app/tech/db/schemas/page.tsx

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
import { useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_1 } from '@/apps/admin/auth/types';

export default function SchemasPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_1);
    const [data, setData] = useState<GetSchemasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        </>
    );
}