'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { sectionsList } from '../../_sections';
import { useEffect, useState } from 'react';
import { useWm } from '@/apps/company/modules';
import { StockBalanceItem } from '@/apps/company/modules/wm/types';
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
import { BalanceItemCard } from '../components/balance-item-card/card';

export default function MovementsBalancePage() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_STOCKS_BALANCE)
    
    const wmModule = useWm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    })

    const [balance, setBalance] = useState<StockBalanceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadBalance();
    }, [searchParams]);

    const loadBalance = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;
            const unitId = searchParams.get('unit_id') || undefined;

            const response = await wmModule.getStockBalance(unitId);
            
            if (response.status && response.data) {
                let items = response.data;
                
                // Фильтрация по поиску на фронте (бэкенд пока не поддерживает)
                if (search) {
                    items = items.filter(item => 
                        item.unit_name.toLowerCase().includes(search.toLowerCase())
                    );
                }
                
                // Пагинация на фронте
                const offset = (page - 1) * limit;
                const paginatedItems = items.slice(offset, offset + limit);
                
                setBalance(paginatedItems);
                setTotal(items.length);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading balance:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_STOCKS_BALANCE} />
    );

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const pages = Math.ceil(total / limit);
    const search = searchParams.get('search') || undefined;
    const unitId = searchParams.get('unit_id') || undefined;

    const queryParams: Record<string, string> = {};
    if (limit) queryParams.limit = String(limit);
    if (search) queryParams.search = search;
    if (unitId) queryParams.unit_id = unitId;

    return (
        <>
            <PlatformHead
                title='Остатки'
                description="Остатки товаров на складе. Расчёт на основании поставок и отгрузок."
                sections={sectionsList(companyId)}
                searchProps={{
                    placeholder: 'Поиск по названию товара',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: (value) => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (value.trim()) {
                            params.set('search', value);
                            params.set('page', '1');
                        } else {
                            params.delete('search');
                        }
                        router.push(`${pathname}?${params.toString()}`);
                    }
                }}
                showSearch
                docsEscort={{
                    href: DOCS_LINK_WM_MOVEMENT,
                    title: 'Подробнее о поставках & отгрузках'
                }}
            />
            
            {balance.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Информации об остатках на складе пока нет.'
                    description='Создайте поставку для добавления товаров на склад.'
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {balance.map((item) => (
                            <BalanceItemCard 
                                key={item.unit_id} 
                                balance={item} 
                                className={styles.item} 
                            />
                        ))}
                    </div>
                    {pages > 1 && (
                        <div className={styles.pagination}>
                            <PlatformPagination
                                meta={{
                                    total,
                                    page,
                                    limit,
                                    pages,
                                }}
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