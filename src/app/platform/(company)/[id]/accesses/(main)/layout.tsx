'use client';

import { PlatformHeadAction, PlatformHeadSection } from "@/app/platform/components/lib/head/_types";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { CompanyLayoutProps } from "../../layout";
import Keyhole from "@/assets/ui-kit/icons/keyhole";
import Plus from "@/assets/ui-kit/icons/plus";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { useParams } from "next/navigation";

export default function Layout({
  children
}: CompanyLayoutProps) {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.ACCOUNTS, {allowExpired: true})
    const ALLOW_INVITE = usePermission(PERMISSIONS.ACCOUNTS_INVITATIONS_CREATE, {allowExpired: true})

    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.ACCOUNTS} />
    )

    const sections: PlatformHeadSection[] = [
        {
            label: "Подключенные аккаунты",
            value: "accounts",
            href: `/platform/${companyId}/accesses`,
            exact: true,
        },
        {
            label: "Приглашения",
            value: "invitations",
            href: `/platform/${companyId}/accesses/invitations`,
            exact: true
        }
    ]
    const actions: PlatformHeadAction[] = (ALLOW_INVITE.allowed && !ALLOW_INVITE.isLoading) ?  [
        {
            children: "Пригласить",
            variant: "accent",
            as: 'link',
            href: `/platform/${companyId}/accesses/invite`,
            icon: <Plus />
        }
    ] : [];;
    return (
        <>
            <PlatformHead
                title="Доступы"
                description="Централизованное управление аккаунтами и разрешениями. Приглашайте пользователей и контролируйте разрешения с точностью до действий модулей."
                sections={sections}
                actions={actions}
            />
            {children}
        </>
    )
}