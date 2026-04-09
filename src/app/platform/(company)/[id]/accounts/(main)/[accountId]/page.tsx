'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useAccounts } from "@/apps/company/modules";
import { CompanyAccount, CompanyAccountSettings } from "@/apps/company/modules/accounts/types";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams } from "next/navigation";
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

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const accountId = params.accountId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.ACCOUNTS);
    const ALLOW_SETTINGS = usePermission(PERMISSIONS.ACCOUNTS_SETTINGS);

    const accountsModule = useAccounts();

    const [account, setAccount] = useState<CompanyAccount | null>(null);
    const [settings, setSettings] = useState<CompanyAccountSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.ACCOUNTS} />
    );

    if (loading || ALLOW_PAGE.isLoading) return <PlatformLoading />;
    if (error) return <PlatformError error={error} />;
    if (!account) return <PlatformError error="Аккаунт не найден" />;

    const fullName = account.name || account.email;
    const initials = fullName.slice(0, 2).toUpperCase();
    const avatarGradient = getGradientFromString(fullName);

    return (
        <>
            <PlatformHead
                title={fullName}
                description={`${roleName[account.role_code]} - аккаунт имеет доступ к пространству организации.`}
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
        </>
    );
}