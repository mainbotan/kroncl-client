import { PlatformFormSectionProps } from "@/app/platform/components/lib/form/_types";
import { PlatformHeadSection } from "@/app/platform/components/lib/head/_types";

export const sectionsList = (companyId: string): PlatformHeadSection[] => {
    return ([
        {
            label: 'Канбан',
            href: `/platform/${companyId}/dm`,
            exact: true
        },
        {
            label: 'Статусы сделок',
            href: `/platform/${companyId}/dm/statuses`,
            strongParams: true,
        },
        {
            label: 'Анализ',
            href: `/platform/${companyId}/wm/analysis`,
            strongParams: true,
        }
    ]);
}