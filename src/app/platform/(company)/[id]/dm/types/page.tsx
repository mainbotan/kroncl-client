'use client';

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.scss';
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { sectionsList } from "../_sections";
import Plus from "@/assets/ui-kit/icons/plus";
import { TypeCard } from "../components/type-card/card";
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useDm } from "@/apps/company/modules";
import { DealTypesResponse } from "@/apps/company/modules/dm/types";
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_TYPES, {allowExpired: true})
    const ALLOW_TYPE_CREATE = usePermission(PERMISSIONS.DM_TYPES_CREATE)

    const dmModule = useDm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<DealTypesResponse | null>(null);
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

            const response = await dmModule.getDealTypes({
                page,
                limit,
                search
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading deal types:', err);
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

    if (!isAllowed(ALLOW_PAGE)) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_TYPES} />
    )

    const dealTypes = data?.deal_types || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    return (
        <>
            <PlatformHead
                title='Типы сделок'
                description='Группировка сделок по типам.'
                sections={sectionsList(companyId)}
                actions={isAllowed(ALLOW_TYPE_CREATE) ? [
                    {
                        children: 'Новый тип',
                        icon: <Plus />,
                        variant: 'accent',
                        as: 'link',
                        href: `/platform/${companyId}/dm/types/new`
                    }
                ] : undefined}
                searchProps={{
                    placeholder: 'Поиск по типам',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {dealTypes.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Типы не найдены' />
            ) : (
                <>
                    <div className={styles.grid}>
                        {dealTypes.map((type) => (
                            <TypeCard 
                                key={type.id} 
                                type={type}
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