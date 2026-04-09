'use client';

import { useAccounts } from '@/apps/company/modules';
import { InvitationCard } from '../components/invitation-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useEffect, useState } from 'react';
import { CompanyInvitationsResponse } from '@/apps/company/modules/accounts/types';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';
import Invitations from '@/assets/ui-kit/icons/invitations';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
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
    const ALLOW_PAGE = usePermission(PERMISSIONS.ACCOUNTS_INVITATIONS)
    const ALLOW_INVITATION_CREATE = usePermission(PERMISSIONS.ACCOUNTS_INVITATIONS_CREATE)
    const ALLOW_INVITATION_REVOKE = usePermission(PERMISSIONS.ACCOUNTS_INVITATIONS_REVOKE)

    const accountsModule = useAccounts();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });

    const [data, setData] = useState<CompanyInvitationsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');

            const response = await accountsModule.getInvitations({
                page,
                limit
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading invitations:', err);
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
        <PlatformNotAllowed permission={PERMISSIONS.ACCOUNTS_INVITATIONS} />
    )

    const invitations = data?.invitations || [];
    const pagination = data?.pagination;

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;

    
    return (
        <>
            <PlatformHead
                title='Приглашения'
                description='Вступление аккаунтов в организацию.'
                sections={sectionsList(companyId)}
                actions={isAllowed(ALLOW_INVITATION_CREATE) ? [{
                    as: 'link',
                    variant: 'accent',
                    children: 'Пригласить',
                    href: `/platform/${companyId}/accounts/invite`
                }] : undefined}
            />
            {invitations.length === 0 ? (
                <PlatformEmptyCanvas
                    title='Приглашения не найдены' 
                    icon={<Invitations />}
                    />
            ) : (
                <>
                    {invitations.map((invitation) => (
                        <InvitationCard 
                            key={invitation.id} 
                            invitation={invitation} 
                            canRevoke={!ALLOW_INVITATION_REVOKE.isLoading && ALLOW_INVITATION_REVOKE.allowed}/>
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