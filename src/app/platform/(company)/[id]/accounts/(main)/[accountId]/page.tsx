'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useAccounts } from "@/apps/company/modules";
import { CompanyAccount, CompanyAccountSettings } from "@/apps/company/modules/accounts/types";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.scss';
import { getGradientFromString } from "@/assets/utils/avatars";
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { roleName } from "@/app/platform/(manage)/(home)/companies/components/company-card/card";
import { PermissionsWizard } from "../../components/permissions-wizard/wizard";
import Exit from "@/assets/ui-kit/icons/exit";
import { useAuth } from "@/apps/account/auth/context/AuthContext";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { DOCS_LINK_COMPANIES_ACCESSES } from "@/app/docs/(v1)/internal.config";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const accountId = params.accountId as string;
    const { user } = useAuth();
    const router = useRouter();
    const { showMessage } = useMessage();

    const ALLOW_PAGE = usePermission(PERMISSIONS.ACCOUNTS);
    const ALLOW_SETTINGS = usePermission(PERMISSIONS.ACCOUNTS_SETTINGS);
    const ALLOW_DELETE = usePermission(PERMISSIONS.ACCOUNTS_DELETE);

    const accountsModule = useAccounts();

    const [account, setAccount] = useState<CompanyAccount | null>(null);
    const [settings, setSettings] = useState<CompanyAccountSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!accountId) return;

            setLoading(true);
            setError(null);
            try {
                const [accountResponse, settingsResponse] = await Promise.all([
                    accountsModule.getAccount(accountId),
                    accountsModule.getSettings(accountId)
                ]);

                if (!isMounted) return;

                if (!accountResponse.status) {
                    setError(accountResponse.message || "Не удалось загрузить аккаунт");
                    return;
                }
                setAccount(accountResponse.data);

                if (ALLOW_SETTINGS.allowed && !ALLOW_SETTINGS.isLoading) {
                    if (settingsResponse.status) {
                        setSettings(settingsResponse.data);
                    }
                }
            } catch (err) {
                if (!isMounted) return;
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading account ${accountId}:`, err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [accountId, ALLOW_SETTINGS.allowed, ALLOW_SETTINGS.isLoading]);

    const handleDropAccount = async () => {
        setIsDeleting(true);
        try {
            const response = await accountsModule.dropAccount(accountId);
            if (response.status) {
                showMessage({
                    label: 'Аккаунт удалён из организации',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/accounts`);
            } else {
                throw new Error(response.message || 'Ошибка удаления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось удалить аккаунт',
                variant: 'error'
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.ACCOUNTS} />
    );

    if (loading || ALLOW_PAGE.isLoading) return <PlatformLoading />;
    if (error) return <PlatformError error={error} />;
    if (!account) return <PlatformError error="Аккаунт не найден" />;
    if (!user) return <PlatformLoading />;

    const fullName = account.name || account.email;
    const initials = fullName.slice(0, 2).toUpperCase();
    const avatarGradient = getGradientFromString(fullName);

    return (
        <>
            <PlatformHead
                title={fullName}
                description={`${roleName[account.role_code]} - аккаунт имеет доступ к пространству организации.`}
                actions={(user.id !== account.id && isAllowed(ALLOW_DELETE)) ? [
                    {
                        icon: <Exit />,
                        variant: 'light',
                        children: 'Выгнать',
                        onClick: () => setIsDeleteModalOpen(true)
                    }
                ] : undefined}
                docsEscort={{
                    href: DOCS_LINK_COMPANIES_ACCESSES,
                    title: 'Подробнее о доступах в организацию'
                }}
            />
            <div className={styles.grid}>
                {isAllowed(ALLOW_SETTINGS) && (
                    <PermissionsWizard 
                        className={styles.wizard} 
                        accountId={accountId}
                        onSave={async (increase, reduce) => {
                            const response = await accountsModule.updateSettings(accountId, {
                                increase_permissions: increase,
                                reduce_permissions: reduce
                            });
                            if (response.status) {
                                const newSettings = await accountsModule.getSettings(accountId);
                                if (newSettings.status) {
                                    setSettings(newSettings.data);
                                }
                            }
                        }}
                    />
                )}
            </div>

            <PlatformModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Выгнать участника?'
                    description={`Аккаунт ${fullName} будет удалён из организации. Это действие нельзя отменить.`}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setIsDeleteModalOpen(false),
                            disabled: isDeleting
                        },
                        {
                            variant: 'red',
                            onClick: handleDropAccount,
                            children: isDeleting ? 'Удаление...' : 'Выгнать',
                            disabled: isDeleting
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}