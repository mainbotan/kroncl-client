import { PlatformHeadAction, PlatformHeadSection } from "@/app/platform/components/lib/head/_types";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { CompanyLayoutProps } from "../../layout";
import Keyhole from "@/assets/ui-kit/icons/keyhole";
import Plus from "@/assets/ui-kit/icons/plus";
import { useMessage } from "@/app/platform/components/lib/message/provider";

export default function Layout({
  children,
  params
}: CompanyLayoutProps) {
    const companyId = params.id;
    
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
    ];
    const actions: PlatformHeadAction[] = [
        {
            children: "Пригласить",
            variant: "accent",
            as: 'link',
            href: `/platform/${companyId}/accesses/invite`,
            icon: <Plus />
        }
    ];
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