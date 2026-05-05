'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { adminCompaniesApi } from '@/apps/admin/companies/api';
import { AdminCompany, GetCompaniesResponse } from '@/apps/admin/companies/types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { CompanyCard } from './components/company-card/card';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_3 } from '@/apps/admin/auth/types';

export default function CompaniesPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_3);
    const [data, setData] = useState<GetCompaniesResponse | null>(null);
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
        if (!isAdmin) return;
        loadCompanies();
    }, [searchParams, isAdmin]);

    const loadCompanies = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;

            const response = await adminCompaniesApi.getAllCompanies({
                page,
                limit,
                search,
            });
            
            if (response.status && response.data) {
                setData(response.data);
            } else {
                setError('Не удалось загрузить список компаний');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading companies:', err);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    const companies = data?.companies || [];
    const pagination = data?.pagination;
    const search = searchParams.get('search') || undefined;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    if (search) queryParams.search = search;

    return (
        <>
            <PlatformHead
                title='Организации'
                description='Организации [тенанты], созданные пользователями.'
                searchProps={{
                    placeholder: 'Поиск по названию или slug',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {companies.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Организации не найдены'
                    description={searchParams.get('search') ? 'Попробуйте изменить поисковый запрос' : 'В системе нет созданных организаций'}
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {companies.map((company: AdminCompany) => (
                            <CompanyCard 
                                key={company.id} 
                                company={company} 
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