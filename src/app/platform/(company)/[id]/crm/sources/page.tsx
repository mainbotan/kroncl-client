'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Plus from "@/assets/ui-kit/icons/plus";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from './page.module.scss';
import { SourceCard } from "./components/source-card/card";
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { SourcesResponse, ClientSource } from '@/apps/company/modules/crm/types';
import { useCrm } from "@/apps/company/modules";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const crmModule = useCrm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<SourcesResponse | null>(null);
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
            const type = searchParams.get('type') as any;
            const status = searchParams.get('status') as any;
            const system = searchParams.get('system') === 'true' ? true : 
                          searchParams.get('system') === 'false' ? false : undefined;

            const response = await crmModule.getSources({
                page,
                limit,
                search,
                type,
                status,
                system
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading sources:', err);
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

    const sources = data?.sources || [];
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
    const systemParam = searchParams.get('system');
    if (systemParam) queryParams.system = systemParam;

    return (
        <>
            <PlatformHead
                title='Ресурсы привлечения'
                description="Управление источниками трафика"
                actions={[
                    {
                        icon: <Plus />,
                        variant: 'accent',
                        children: 'Новый источник',
                        href: `/platform/${companyId}/crm/sources/new`,
                        as: 'link'
                    }
                ]}
                sections={[
                    {
                        label: 'Все',
                        href: `/platform/${companyId}/crm/sources`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Активные',
                        href: `/platform/${companyId}/crm/sources?status=active`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Неактивные',
                        href: `/platform/${companyId}/crm/sources?status=inactive`,
                        exact: true,
                        strongParams: true
                    },
                    {
                        label: 'Системные',
                        href: `/platform/${companyId}/crm/sources?system=true`,
                        exact: true,
                        strongParams: true
                    }
                ]}
                searchProps={{
                    placeholder: 'Поиск по источникам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {sources.length === 0 ? (
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: ".7em", 
                    color: "var(--color-text-description)", 
                    minHeight: "10rem"
                }}>
                    Источники не найдены
                </div>
            ) : (
                <>
                <div className={styles.grid}>
                    {sources.map((source: ClientSource) => (
                        <SourceCard key={source.id} source={source} />
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