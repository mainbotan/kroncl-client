'use client';

import { useAccounts } from '@/apps/company/modules';
import { MemberCard } from '../components/member-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { CompanyAccountsResponse } from '@/apps/company/modules/accounts/types';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import Team from '@/assets/ui-kit/icons/team';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { sectionsList } from '../_sections';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.ACCOUNTS, {allowExpired: true})
    const ALLOW_ACCOUNT_KICK = usePermission(PERMISSIONS.ACCOUNTS_DELETE, {allowExpired: true})

    const accountsModule = useAccounts();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<CompanyAccountsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Получаем параметры из URL или используем дефолтные
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search');
            const role = searchParams.get('role');

            const response = await accountsModule.getAll({
                page,
                limit,
                search: search || undefined,
                role: role || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading accounts:', err);
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
        <PlatformNotAllowed permission={PERMISSIONS.ACCOUNTS} />
    )

    const accounts = data?.accounts || [];
    const pagination = data?.pagination;

    // Подготавливаем queryParams для PlatformPagination
    const queryParams: Record<string, string> = {};
    
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    
    const roleParam = searchParams.get('role');
    if (roleParam) queryParams.role = roleParam;

    return (
        <>
            <PlatformHead
                title='Аккаунты'
                description='Пользователи, имеющие доступ к организации. Управление разрешениями, удаление из компании.'
                sections={sectionsList(companyId)}
            />
            {accounts.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Участники не найдены.'
                    icon={<Team />} />
            ) : (
                <>
                    {accounts.map((account) => (
                        <MemberCard 
                            key={account.id} 
                            account={account}
                            canKick={!ALLOW_ACCOUNT_KICK.isLoading && ALLOW_ACCOUNT_KICK.allowed} 
                        />
                    ))}
                    
                    {pagination && pagination.pages > 1 && (
                        <PlatformPagination
                            meta={pagination}
                            baseUrl={pathname}
                            queryParams={queryParams}
                            onPageChange={(page) => handlePageChange(page)}
                        />
                    )}
                </>
            )}
        </>
    );
}