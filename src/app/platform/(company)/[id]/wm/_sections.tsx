import { PlatformFormSectionProps } from "@/app/platform/components/lib/form/_types";
import { PlatformHeadSection } from "@/app/platform/components/lib/head/_types";

export const sectionsList = (companyId: string): PlatformHeadSection[] => {
    return ([
        {
            label: 'Структура каталога',
            href: `/platform/${companyId}/wm`,
            exact: true
        },
        {
            label: 'Остатки & Наличие',
            href: `/platform/${companyId}/wm/stocks`,
            strongParams: true,
        },
        {
            label: 'Акции & Предложения',
            href: `/platform/${companyId}/wm/offers`,
            strongParams: true
        }
    ]);
}