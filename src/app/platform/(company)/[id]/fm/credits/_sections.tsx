import { PlatformHeadSection } from "@/app/platform/components/lib/head/_types";

export const sectionsList = (companyId: string): PlatformHeadSection[] => {
    return [
        {
            label: 'Главное',
            exact: true,
            href: `/platform/${companyId}/fm/credits`
        },
        {
            label: 'Контрагенты',
            href: `/platform/${companyId}/fm/credits/counterparties`
        },
        {
            label: 'Оценка рисков',
            href: `/platform/${companyId}/fm/credits/risks`
        }
    ];
}