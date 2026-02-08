'use client';

import { useAccounts } from '@/apps/company/modules';
import { MemberCard } from '../../components/member-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { CompanyAccountsResponse } from '@/apps/company/modules/accounts/types';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export default function Page() {
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
            {accounts.length === 0 ? (
                <div style={{
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    fontSize: ".7em", 
                    color: "var(--color-text-description)", 
                    minHeight: "10rem"
                }}>
                    Участники не найдены
                </div>
            ) : (
                <>
                    {accounts.map((account) => (
                        <MemberCard key={account.id} account={account} />
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