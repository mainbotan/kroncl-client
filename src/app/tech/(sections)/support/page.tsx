'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { adminSupportApi } from '@/apps/admin/support/api';
import { AdminTicket, GetTicketsResponse } from '@/apps/admin/support/types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './layout.module.scss';
import { TicketCard } from './components/ticket-card/card';
import { isAdminAllowed, useAdminLevel } from '@/apps/admin/auth/hook';
import { ADMIN_LEVEL_4 } from '@/apps/admin/auth/types';

export default function SupportTicketsPage() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const { allowed: isAdmin, isLoading: adminLoading } = useAdminLevel(ADMIN_LEVEL_4);
    const [data, setData] = useState<GetTicketsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAdmin) return;
        loadTickets();
    }, [searchParams, isAdmin]);

    const loadTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');

            const response = await adminSupportApi.getTickets({
                status: 'pending',
                page,
                limit,
            });
            
            if (response.status && response.data) {
                setData(response.data);
            } else {
                setError('Не удалось загрузить тикеты');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    if (adminLoading || loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!isAdmin) return <PlatformError error="Доступ запрещён" />;

    const tickets = data?.tickets || [];
    const pagination = data?.pagination;

    return (
        <>
            <PlatformHead
                title='Тикеты компаний'
                description='Созданные компаниями тикеты в техническую поддержку. Отображаются только ожидающие обработки.'
                showSearch={false}
                actions={[
                    {
                        children: 'Архив тикетов',
                        variant: 'light',
                        as: 'link',
                        href: '/tech/support/archive'
                    }
                ]}
            />
            {tickets.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Нет активных тикетов'
                    description='Все тикеты обработаны'
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {tickets.map((ticket: AdminTicket) => (
                            <TicketCard 
                                key={ticket.id} 
                                ticket={ticket} 
                                className={styles.item} 
                            />
                        ))}
                    </div>
                    {pagination && pagination.pages > 1 && (
                        <div className={styles.pagination}>
                            <PlatformPagination
                                meta={pagination}
                                baseUrl={pathname}
                                onPageChange={(page) => handlePageChange(page)}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
}