'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Plus from "@/assets/ui-kit/icons/plus";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from './page.module.scss';
import { CategoryCard } from "./components/category-card/card";
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { CategoriesResponse, TransactionCategory } from '@/apps/company/modules/fm/types';
import { useFm } from "@/apps/company/modules";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const fmModule = useFm();
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
            const search = searchParams.get('search') || undefined;
            const direction = searchParams.get('direction') as 'income' | 'expense' | undefined;

            const response = await fmModule.getCategories({
                page,
                limit,
                search,
                direction
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

    const categories = data?.categories || [];
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
                title='Категории трат и доходов'
                description="Анализ операций по категориям. Управление категориями."
                actions={[
                    {
                        icon: <Plus />,
                        variant: 'accent',
                        children: 'Новая категория',
                        href: `/platform/${companyId}/fm/categories/new`,
                        as: 'link'
                    }
                ]}
                sections={[
                    {
                        label: 'Все',
                        href: `/platform/${companyId}/fm/categories`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Расходные',
                        href: `/platform/${companyId}/fm/categories?direction=expense`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Доходные',
                        href: `/platform/${companyId}/fm/categories?direction=income`,
                        exact: true,
                        strongParams: true
                    }
                ]}
                searchProps={{
                    placeholder: 'Поиск по категориям',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {categories.length === 0 ? (
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: ".7em", 
                    color: "var(--color-text-description)", 
                    minHeight: "10rem"
                }}>
                    Категории не найдены
                </div>
            ) : (
                <>
                <div className={styles.grid}>
                    {categories.map((category: TransactionCategory) => (
                        <CategoryCard key={category.id} category={category} />
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