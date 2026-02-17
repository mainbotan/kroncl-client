'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import Plus from '@/assets/ui-kit/icons/plus';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { sectionsList } from '../_sections';
import { CounterpartyCard } from './components/counterparty-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { CounterpartiesResponse, Counterparty } from '@/apps/company/modules/fm/types';
import { useFm } from '@/apps/company/modules';

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

    const [data, setData] = useState<CounterpartiesResponse | null>(null);
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
            const type = searchParams.get('type') as 'bank' | 'organization' | 'person' | undefined;
            const status = searchParams.get('status') as 'active' | 'inactive' | undefined;

            const response = await fmModule.getCounterparties({
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
            console.error('Error loading counterparties:', err);
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

    const counterparties = data?.counterparties || [];
    const pagination = data?.pagination;

    return (
        <>
            <PlatformHead
                title='Контрагенты'
                description='Управление базой кредиторов/дебиторов.'
                actions={[
                    {
                        icon: <Plus />,
                        variant: 'accent',
                        children: 'Создать контрагента',
                        href: `/platform/${companyId}/fm/credits/counterparties/new`,
                        as: 'link'
                    }
                ]}
                sections={sectionsList(companyId)}
                showSearch={true}
                searchProps={{
                    placeholder: 'Поиск по контрагентам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
            />
            {counterparties.length === 0 ? (
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: ".7em", 
                    color: "var(--color-text-description)", 
                    minHeight: "10rem"
                }}>
                    Контрагенты не найдены
                </div>
            ) : (
                <>
                <div className={styles.grid}>
                    {counterparties.map((counterparty: Counterparty) => (
                        <CounterpartyCard key={counterparty.id} counterparty={counterparty} />
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