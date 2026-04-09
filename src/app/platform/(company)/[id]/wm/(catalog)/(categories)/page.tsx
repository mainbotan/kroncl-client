'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useSideContent } from "@/app/platform/components/side-content/context";
import Plus from "@/assets/ui-kit/icons/plus";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { sectionsList } from "../../_sections";
import styles from './page.module.scss';
import { CategoryCard } from "../../components/category-card/card";
import { useEffect, useState } from 'react';
import { CategoriesResponse, CatalogCategory } from '@/apps/company/modules/wm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { useWm } from "@/apps/company/modules";
import clsx from "clsx";
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import TwoCards from "@/assets/ui-kit/icons/two-cards";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

export default function CatalogPage() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_CATALOG_CATEGORIES)
    const ALLOW_CATEGORY_CREATE = usePermission(PERMISSIONS.WM_CATALOG_CATEGORIES_CREATE);   
    
    const wmModule = useWm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<CategoriesResponse | null>(null);
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

    const handleCategoryClick = (category: CatalogCategory) => {
        // При клике на категорию добавляем её ID в параметры для отображения подкатегорий
        const params = new URLSearchParams(searchParams.toString());
        params.set('category_id', category.id);
        params.delete('page'); // Сбрасываем страницу при переходе в подкатегорию
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
            const status = searchParams.get('status') as any;

            const response = await wmModule.getCategories({
                page,
                limit,
                search: search || undefined,
                status: status || undefined,
                parent_id: categoryId || null
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_CATALOG_CATEGORIES} />
    )

    const categories = data?.categories || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;
    if (categoryId) queryParams.category_id = categoryId;

    return (
        <>
            <PlatformHead
                title='Каталог & Склад'
                description="Управление ассортиментом услуг и товаров. Контроль остатков."
                actions={(!ALLOW_CATEGORY_CREATE.isLoading && ALLOW_CATEGORY_CREATE.allowed) ? [
                    {
                        children: 'Категория',
                        variant: 'accent',
                        as: 'link',
                        href: categoryId 
                            ? `/platform/${companyId}/wm/new?parent_id=${categoryId}`
                            : `/platform/${companyId}/wm/new`,
                        icon: <Plus />
                    }
                ] : undefined}
                sections={sectionsList(companyId)}
                searchProps={{
                    placeholder: 'Поиск по категориям',
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
                        Назад
                    </button>
                    <button 
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete('category_id');
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                        className={clsx(styles.button, styles.accent)}
                    >
                        {categoryId}
                    </button>
                </div>
            )}
            {categories.length === 0 ? (
                <PlatformEmptyCanvas
                    title={categoryId ? 'В этой категории нет подкатегорий.' : 'Категорий пока нет.'}
                    icon={<TwoCards />}
                />
            ) : (
                <>
                <div className={styles.grid}>
                    {categories.map((category) => (
                        <CategoryCard 
                            key={category.id} 
                            category={category} 
                            className={styles.item}
                            // onClick={handleCategoryClick}
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