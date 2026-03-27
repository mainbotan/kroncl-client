'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useSideContent } from "@/app/platform/components/side-content/context";
import Plus from "@/assets/ui-kit/icons/plus";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { sectionsList } from "../../_sections";
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { UnitsResponse, CatalogUnit } from '@/apps/company/modules/wm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { useWm } from "@/apps/company/modules";
import { UnitCard } from "../../components/unit-card/card";
import clsx from "clsx";
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import TwoCards from "@/assets/ui-kit/icons/two-cards";

export default function UnitsPage() {
    const params = useParams();
    const companyId = params.id as string;
    const wmModule = useWm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<UnitsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoryId = searchParams.get('category_id');

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
    }, [searchParams, categoryId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search');
            const type = searchParams.get('type') as any;
            const status = searchParams.get('status') as any;
            const inventoryType = searchParams.get('inventory_type') as any;

            const response = await wmModule.getUnits({
                page,
                limit,
                search: search || undefined,
                type: type || undefined,
                status: status || undefined,
                inventory_type: inventoryType || undefined,
                category_id: categoryId || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading units:', err);
        } finally {
            setLoading(false);
        }
    };

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

    const units = data?.units || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    const typeParam = searchParams.get('type');
    if (typeParam) queryParams.type = typeParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;
    const inventoryTypeParam = searchParams.get('inventory_type');
    if (inventoryTypeParam) queryParams.inventory_type = inventoryTypeParam;
    if (categoryId) queryParams.category_id = categoryId;

    return (
        <>
            <PlatformHead
                title='Товарные позиции'
                description="Управление ассортиментом услуг и товаров. Контроль остатков."
                actions={[
                    {
                        children: 'Товарная позиция',
                        variant: 'accent',
                        as: 'link',
                        href: categoryId 
                            ? `/platform/${companyId}/wm/units/new?category_id=${categoryId}`
                            : `/platform/${companyId}/wm/units/new`,
                        icon: <Plus />
                    }
                ]}
                sections={sectionsList(companyId)}
                searchProps={{
                    placeholder: 'Поиск по товарным позициям',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch={true}
            />
            {categoryId && (
                <div className={styles.control}>
                    <button 
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete('category_id');
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                        className={styles.button}
                    >
                        Назад к списку
                    </button>
                    <span className={clsx(styles.button, styles.accent)}>
                        Фильтр по категории
                    </span>
                </div>
            )}
            {units.length === 0 ? (
                <PlatformEmptyCanvas
                    title={categoryId ? 'В этой категории нет товарных позиций.' : 'Товарных позиций пока нет.'}
                    icon={<TwoCards />} />
            ) : (
                <>
                <div className={styles.grid}>
                    {units.map((unit) => (
                        <UnitCard 
                            key={unit.id} 
                            unit={unit} 
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