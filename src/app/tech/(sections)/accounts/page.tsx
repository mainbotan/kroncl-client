'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { adminAccountsApi } from '@/apps/admin/accounts/api';
import { Account } from '@/apps/account/types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import { AccountCard } from './components/account-card/card';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_2 } from '@/apps/admin/auth/types';
import { AccountsStatsBlock } from './components/summary-stats/block';

export default function AccountsPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_2);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [total, setTotal] = useState(0);
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
        if (!isAdmin) return;
        loadAccounts();
    }, [searchParams, isAdmin]);

    const loadAccounts = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;

            const response = await adminAccountsApi.getAllAccounts({
                page,
                limit,
                search,
            });
            
            if (response.status && response.data) {
                setAccounts(response.data.accounts);
                setTotal(response.data.pagination.total);
            } else {
                setError('Не удалось загрузить аккаунты');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const pages = Math.ceil(total / limit);
    const search = searchParams.get('search') || undefined;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    if (search) queryParams.search = search;

    return (
        <>
            <PlatformHead
                title='Аккаунты'
                description='Зарегистрированные аккаунты, управление.'
                searchProps={{
                    placeholder: 'Поиск по email или имени',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            >
                <AccountsStatsBlock className={styles.stats} />
            </PlatformHead>
            {!accounts ? (
                <PlatformEmptyCanvas 
                    title='Аккаунты не найдены'
                    description={searchParams.get('search') ? 'Попробуйте изменить поисковый запрос' : 'В системе нет зарегистрированных аккаунтов'}
                />
            ) : (
                <>
                    <div className={styles.container}>
                        {accounts.map((account) => (
                            <AccountCard 
                                key={account.id} 
                                account={account} 
                            />
                        ))}
                    </div>
                    {pages > 1 && (
                        <div className={styles.pagination}>
                            <PlatformPagination
                                meta={{
                                    total,
                                    page,
                                    limit,
                                    pages,
                                }}
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