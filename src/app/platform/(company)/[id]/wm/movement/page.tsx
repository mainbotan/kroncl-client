'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { sectionsList } from '../_sections';
import Plus from '@/assets/ui-kit/icons/plus';
import Minus from '@/assets/ui-kit/icons/minus';
import { BatchCard } from '../components/batch-card/card';
import { useEffect, useState } from 'react';
import { useWm } from '@/apps/company/modules';
import { StockBatchesResponse } from '@/apps/company/modules/wm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import TwoCards from '@/assets/ui-kit/icons/two-cards';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { DOCS_LINK_WM_MOVEMENT } from '@/app/docs/(v1)/internal.config';

export default function MovementsPage() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_STOCKS_BATCHES)
    const ALLOW_BATCH_CREATE = usePermission(PERMISSIONS.WM_STOCKS_BATCHES_CREATE);   
    
    const wmModule = useWm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    })

    const [data, setData] = useState<StockBatchesResponse | null>(null);
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

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search');
            const direction = searchParams.get('direction') as any;

            const response = await wmModule.getStockBatches({
                page,
                limit,
                search: search || undefined,
                direction: direction || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading batches:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error}/>
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_STOCKS_BATCHES} />
    )

    const batches = data?.batches || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    const directionParam = searchParams.get('direction');
    if (directionParam) queryParams.direction = directionParam;

    return (
        <>
            <PlatformHead
                title='Движение товаров'
                description="Управление поставками & отгрузками товаров."
                actions={(!ALLOW_BATCH_CREATE.isLoading && ALLOW_BATCH_CREATE.allowed) ? [
                    {
                        children: 'Отгрузка',
                        variant: 'light',
                        as: 'link',
                        href: `/platform/${companyId}/wm/movement/new?direction=outcome`,
                        icon: <Minus />
                    },
                    {
                        children: 'Поставка',
                        variant: 'accent',
                        as: 'link',
                        href: `/platform/${companyId}/wm/movement/new?direction=income`,
                        icon: <Plus />
                    }
                ] : undefined}
                sections={sectionsList(companyId)}
                searchProps={{
                    placeholder: 'Поиск по поставкам/отгрузкам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch={true}
                docsEscort={{
                    href: DOCS_LINK_WM_MOVEMENT,
                    title: 'Подробнее о поставках & отгрузках'
                }}
            />
            
            {batches.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Документов движения пока нет.'
                    icon={<TwoCards />}
                />
            ) : (
                <>
                <div className={styles.grid}>
                    {batches.map((batch) => (
                        <BatchCard 
                            key={batch.id} 
                            batch={batch} 
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