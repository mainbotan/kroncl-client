'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Plus from "@/assets/ui-kit/icons/plus";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from './page.module.scss';
import { ClientCard } from "../components/client-card/card";
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { ClientsResponse, ClientDetail } from '@/apps/company/modules/crm/types';
import { useCrm } from "@/apps/company/modules";
import { sectionsList } from "../_sections";
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import Clients from "@/assets/ui-kit/icons/clients";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.CRM_CLIENTS)
    const ALLOW_CLIENT_CREATE = usePermission(PERMISSIONS.CRM_CLIENTS_CREATE)

    const crmModule = useCrm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<ClientsResponse | null>(null);
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

            const response = await crmModule.getClients({
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
            console.error('Error loading clients:', err);
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
        <PlatformNotAllowed permission={PERMISSIONS.CRM_CLIENTS} />
    )

    const clients = data?.clients || [];
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

    return (
        <>
            <PlatformHead
                title='CRM'
                description="Управление клиентской базой."
                actions={(!ALLOW_CLIENT_CREATE.isLoading && ALLOW_CLIENT_CREATE.allowed) ? [
                    {
                        icon: <Plus />,
                        variant: 'accent',
                        children: 'Новый клиент',
                        href: `/platform/${companyId}/crm/new`,
                        as: 'link'
                    }
                ] : undefined}
                sections={sectionsList(companyId)}
                searchProps={{
                    placeholder: 'Поиск по клиентам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {clients.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Клиентская база пуста.'
                    icon={<Clients />}
                />
            ) : (
                <>
                <div className={styles.grid}>
                    {clients.map((client: ClientDetail) => (
                        <ClientCard key={client.id} client={client} />
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