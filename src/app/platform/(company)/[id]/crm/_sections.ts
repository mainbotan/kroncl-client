import { PlatformFormSectionProps } from "@/app/platform/components/lib/form/_types";
import { PlatformHeadSection } from "@/app/platform/components/lib/head/_types";

export const sectionsList = (companyId: string): PlatformHeadSection[] => {
    return ([
        {
            label: 'Клиенсткая база',
            href: `/platform/${companyId}/crm`,
            exact: true
        },
        {
            label: 'Ресурсы привлечения',
            href: `/platform/${companyId}/crm/sources`,
            strongParams: true,
        },
        {
            label: 'Анализ',
            href: `/platform/${companyId}/crm/analyse`,
            strongParams: true
        }
    ]);
}