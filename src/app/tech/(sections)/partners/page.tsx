'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { adminPartnersApi } from '@/apps/admin/partners/api';
import { IncomingPartner, GetPartnersResponse } from '@/apps/admin/partners/types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { PartnerCard } from './components/partner-card/card';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';

export default function PartnersPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_4);
    const [data, setData] = useState<GetPartnersResponse | null>(null);
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

    const handleStatusFilter = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        if (!isAdmin) return;
        loadPartners();
    }, [searchParams, isAdmin]);

    const loadPartners = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;
            const status = searchParams.get('status') || undefined;

            const response = await adminPartnersApi.getPartners({
                page,
                limit,
                search,
                status,
            });
            
            if (response.status && response.data) {
                setData(response.data);
            } else {
                setError('Не удалось загрузить заявки');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading partners:', err);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    const partners = data?.partners || [];
    const pagination = data?.pagination;
    const currentStatus = searchParams.get('status') || 'all';

    const statusTabs = [
        { value: 'all', label: 'Все' },
        { value: 'waiting', label: 'Ожидают' },
        { value: 'success', label: 'Одобренные' },
        { value: 'banned', label: 'Заблокированные' },
    ];

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;

    return (
        <>
            <PlatformHead
                title='Заявки на партнёрство'
                description='Просмотр и управление заявками от потенциальных партнёров.'
                searchProps={{
                    placeholder: 'Поиск по названию или email',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {partners.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Заявки не найдены'
                    description={searchParams.get('search') ? 'Попробуйте изменить поисковый запрос' : 'Нет заявок на партнёрство'}
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {partners.map((partner: IncomingPartner) => (
                            <PartnerCard 
                                key={partner.id} 
                                partner={partner} 
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