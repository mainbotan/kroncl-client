import { PlatformFormSectionProps } from "@/app/platform/components/lib/form/_types";
import { PlatformHeadSection } from "@/app/platform/components/lib/head/_types";

export const sectionsList = (companyId: string): PlatformHeadSection[] => {
    return ([
        {
            label: 'Категории',
            href: `/platform/${companyId}/wm`,
            exact: true
        },
        {
            label: 'Товарные позиции',
            href: `/platform/${companyId}/wm/units`,
            strongParams: true,
        },
        {
            label: 'Движение товаров',
            href: `/platform/${companyId}/wm/movement`,
            strongParams: true,
            exact: true,
        },
        {
            label: 'Остатки',
            href: `/platform/${companyId}/wm/movement/balance`,
            strongParams: true,
        }
    ]);
}