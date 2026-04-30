'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import Plus from '@/assets/ui-kit/icons/plus';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { sectionsList } from '../_sections';
import { CreditCard } from './components/credit-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { CreditsResponse, CreditDetail } from '@/apps/company/modules/fm/types';
import { useFm } from '@/apps/company/modules';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import Wallet from '@/assets/ui-kit/icons/wallet';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { DOCS_LINK_FM_DEBT_OBLIGATIONS } from '@/app/docs/(v1)/internal.config';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.FM_CREDITS);
    const ALLOW_CREDIT_CREATE = usePermission(PERMISSIONS.FM_CREDITS_CREATE);   

    const fmModule = useFm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<CreditsResponse | null>(null);
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
            const type = searchParams.get('type') as 'debt' | 'credit' | undefined;
            const status = searchParams.get('status') as 'active' | 'closed' | undefined;

            const response = await fmModule.getCredits({
                page,
                limit,
                search,
                type,
                status
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading credits:', err);
        } finally {
            setLoading(false);
        }
    };

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    const typeParam = searchParams.get('type');
    if (typeParam) queryParams.type = typeParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.FM_CREDITS} />
    )

    const credits = data?.credits || [];
    const pagination = data?.pagination;

    return (
        <>
            <PlatformHead
                title='Долговые обязательства'
                description='Контроль просроченных платежей, база контрагентов (дебиторы/кредиторы), оценка кредитоспособности.'
                actions={(!ALLOW_CREDIT_CREATE.isLoading && ALLOW_CREDIT_CREATE.allowed) ? [
                    {
                        variant: 'glass',
                        children: 'Дали в долг',
                        as: 'link',
                        href: `/platform/${companyId}/fm/credits/new?type=credit`
                    },
                    {
                        icon: <Plus />,
                        variant: 'accent',
                        children: 'Взяли в долг',
                        as: 'link',
                        href: `/platform/${companyId}/fm/credits/new?type=debt`
                    }
                ] : undefined}
                sections={sectionsList(companyId)}
                showSearch={true}
                searchProps={{
                    placeholder: 'Поиск по займам и контрагентам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                docsEscort={{
                    href: DOCS_LINK_FM_DEBT_OBLIGATIONS,
                    title: 'Подробнее о долговых обязательствах'
                }}
            />
            {credits.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Кредиты и займы не найдены.'
                    icon={<Wallet />}
                />
            ) : (
                <>
                <div className={styles.grid}>
                    {credits.map((credit: CreditDetail) => (
                        <CreditCard key={credit.id} credit={credit} className={styles.item} />
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