'use client';

import styles from './page.module.scss';
import { DOCS_LINK_COMPANIES_ACCESSES } from "@/app/docs/(v1)/internal.config";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { InvitationCard } from './components/invitation-card';
import { useEffect, useState } from 'react';
import { AccountInvitation } from '@/apps/account/invitations/types';
import { invitationsApi } from '@/apps/account/invitations/api';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import Mail from "@/assets/ui-kit/icons/mail";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export default function Page() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showMessage } = useMessage();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<{ invitations: AccountInvitation[]; pagination: any } | null>(null);
    
    const [acceptModal, setAcceptModal] = useState<{ isOpen: boolean; invitation: AccountInvitation | null }>({ isOpen: false, invitation: null });
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; invitation: AccountInvitation | null }>({ isOpen: false, invitation: null });
    const [isLoadingAction, setIsLoadingAction] = useState(false);

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

    const loadInvitations = async () => {
        try {
            setLoading(true);
            setError(null);

            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const search = searchParams.get('search') || undefined;

            const response = await invitationsApi.getInvitations({
                page,
                limit,
                search
            });
            
            if (response.status && response.data) {
                setData({
                    invitations: response.data.invitations,
                    pagination: response.data.pagination
                });
            } else {
                setError(response.message || 'Ошибка загрузки');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            console.error('Ошибка при загрузке приглашений:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInvitations();
    }, [searchParams]);

    const handleAccept = async () => {
        if (!acceptModal.invitation) return;
        
        setIsLoadingAction(true);
        try {
            const response = await invitationsApi.acceptInvitation(acceptModal.invitation.id);
            if (!response.status) {
                throw new Error(response.message);
            }
            showMessage({
                label: 'Приглашение принято',
                variant: 'success'
            });
            setAcceptModal({ isOpen: false, invitation: null });
            loadInvitations();
        } catch (error: any) {
            showMessage({
                label: 'Не удалось принять приглашение',
                variant: 'error',
                about: error.message
            });
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleReject = async () => {
        if (!rejectModal.invitation) return;
        
        setIsLoadingAction(true);
        try {
            const response = await invitationsApi.rejectInvitation(rejectModal.invitation.id);
            if (!response.status) {
                throw new Error(response.message);
            }
            showMessage({
                label: 'Приглашение отклонено',
                variant: 'success'
            });
            setRejectModal({ isOpen: false, invitation: null });
            loadInvitations();
        } catch (error: any) {
            showMessage({
                label: 'Не удалось отклонить приглашение',
                variant: 'error',
                about: error.message
            });
        } finally {
            setIsLoadingAction(false);
        }
    };

    if (loading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    const invitations = data?.invitations || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;
    
    return (
        <>
            <PlatformHead
                title='Приглашения'
                description="Приглашения аккаунта в организации. Все приглашения дублируются на почту, привязанную к аккаунту."
                docsEscort={{
                    href: DOCS_LINK_COMPANIES_ACCESSES,
                    title: 'Подробнее о доступах к организациям.'
                }}
                searchProps={{
                    placeholder: 'Поиск по приглашениям',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch
                }}
                showSearch
            />
            {invitations.length === 0 ? (
                <PlatformEmptyCanvas 
                    title='Нет активных приглашений.'
                    icon={<Mail />}
                />
            ) : (
                <>
                    <div className={styles.grid}>
                        {invitations.map(invitation => (
                            <InvitationCard 
                                key={invitation.id} 
                                invitation={invitation}
                                onAccept={() => setAcceptModal({ isOpen: true, invitation })}
                                onReject={() => setRejectModal({ isOpen: true, invitation })}
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

            <PlatformModal
                isOpen={acceptModal.isOpen}
                onClose={() => setAcceptModal({ isOpen: false, invitation: null })}
            >
                <PlatformModalConfirmation
                    title='Принять приглашение?'
                    description={`Вы получите гостевые разрешения в организации ${acceptModal.invitation?.company_name}. После вступления владельцы смогут расширить ваши права.`}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setAcceptModal({ isOpen: false, invitation: null }),
                            disabled: isLoadingAction
                        },
                        {
                            variant: 'accent',
                            onClick: handleAccept,
                            children: isLoadingAction ? 'Принятие...' : 'Принять',
                            disabled: isLoadingAction
                        }
                    ]}
                />
            </PlatformModal>

            <PlatformModal
                isOpen={rejectModal.isOpen}
                onClose={() => setRejectModal({ isOpen: false, invitation: null })}
            >
                <PlatformModalConfirmation
                    title='Отклонить приглашение?'
                    description={`Вы уверены, что хотите отклонить приглашение в организацию ${rejectModal.invitation?.company_name}?`}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setRejectModal({ isOpen: false, invitation: null }),
                            disabled: isLoadingAction
                        },
                        {
                            variant: 'accent',
                            onClick: handleReject,
                            children: isLoadingAction ? 'Отклонение...' : 'Отклонить',
                            disabled: isLoadingAction
                        }
                    ]}
                />
            </PlatformModal>
        </>
    )
}