import { PlatformFormSectionProps } from "@/app/platform/components/lib/form/_types";
import { PlatformHeadSection } from "@/app/platform/components/lib/head/_types";

export const sectionsList = (companyId: string): PlatformHeadSection[] => {
    return ([
        {
            label: 'Подключенные аккаунты',
            href: `/platform/${companyId}/accounts`,
            exact: true
        },
        {
            label: 'Приглашения',
            href: `/platform/${companyId}/accounts/invitations`,
            strongParams: true,
        }
    ]);
}