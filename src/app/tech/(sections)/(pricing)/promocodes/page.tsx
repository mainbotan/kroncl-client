// app/tech/pricing/promocodes/page.tsx

'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { adminPricingPromocodesApi } from '@/apps/admin/pricing/promocodes/api';
import { Promocode, GetPromocodesResponse } from '@/apps/admin/pricing/promocodes/types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';
import { PromocodeCard } from './components/promocode-card/card';

export default function PromocodesPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_4);
    const [data, setData] = useState<GetPromocodesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAdmin) return;
        loadPromocodes();
    }, [searchParams, isAdmin]);

    const loadPromocodes = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');

            const response = await adminPricingPromocodesApi.getPromocodes({
                page,
                limit,
            });
            
            if (response.status && response.data) {
                setData(response.data);
            } else {
                setError('Не удалось загрузить промокоды');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading promocodes:', err);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    const promocodes = data?.promocodes || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;

    return (
        <>
            <PlatformHead
                title='Промокоды'
                description='Управление промокодами для триальных периодов.'
                actions={[
                    {
                        variant: 'accent',
                        children: 'Создать новый',
                        as: 'link',
                        href: '/tech/promocodes/new'
                    }
                ]}
            />
            {promocodes.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Промокоды не найдены'
                    description='Нет созданных промокодов'
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {promocodes.map((promocode: Promocode) => (
                            <PromocodeCard
                                key={promocode.id}
                                promocode={promocode}
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