'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { sections } from '../_sections';
import Plus from '@/assets/ui-kit/icons/plus';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PositionCard } from '../../components/position-card/card';
import { useHrm } from '@/apps/company/modules';
import { PositionsResponse, Position } from '@/apps/company/modules/hrm/types';
import { useEffect, useState } from 'react';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { DOCS_LINK_HRM_POSITIONS } from '@/app/docs/(v1)/internal.config';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const hrmModule = useHrm();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const ALLOW_PAGE = usePermission(PERMISSIONS.HRM_POSITIONS);
    const ALLOW_CREATE = usePermission(PERMISSIONS.HRM_POSITIONS_CREATE);

    const [data, setData] = useState<PositionsResponse | null>(null);
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
            const search = searchParams.get('search');

            const response = await hrmModule.getPositions({
                page,
                limit,
                search: search || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading positions:', err);
        } finally {
            setLoading(false);
        }
    };

    if (ALLOW_PAGE.isLoading) return <PlatformLoading />;

    if (!ALLOW_PAGE.allowed) return <PlatformNotAllowed permission={PERMISSIONS.HRM_POSITIONS} />;

    if (loading) return <PlatformLoading />;

    if (error) return <PlatformError error={error} />;

    const positions = data?.positions || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    return (
        <>
            <PlatformHead
                title='Должности'
                description='Настройка должностей сотрудников.'
                sections={sections(companyId)}
                actions={ALLOW_CREATE.allowed ? [
                    {
                        children: 'Новая должность',
                        icon: <Plus />,
                        variant: 'accent',
                        as: 'link',
                        href: `/platform/${companyId}/hrm/positions/new`
                    }
                ] : undefined}
                searchProps={{
                    placeholder: 'Поиск по должностям',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch={true}
                docsEscort={{
                    href: DOCS_LINK_HRM_POSITIONS,
                    title: 'Подробнее о должностях'
                }}
            />
            {positions.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Должностей пока нет.'
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {positions.map((position: Position) => (
                            <PositionCard key={position.id} position={position} className={styles.item} />
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