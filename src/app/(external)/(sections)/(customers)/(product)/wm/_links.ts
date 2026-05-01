import { QuickLink } from "@/app/(external)/components/quick-links/quick-links";
import { DOCS_LINK_WM, DOCS_LINK_WM_ANALYSIS, DOCS_LINK_WM_CATALOG, DOCS_LINK_WM_CATALOG_UNITS, DOCS_LINK_WM_MOVEMENT } from "@/app/docs/(v1)/internal.config";

export const linksList: QuickLink[] = [
    {
        capture: 'Введение в модуль',
        href: DOCS_LINK_WM
    },
    {
        capture: 'Каталог',
        href: DOCS_LINK_WM_CATALOG
    },
    {
        capture: 'Товарные позиции',
        href: DOCS_LINK_WM_CATALOG_UNITS
    },
    {
        capture: 'Движение товаров',
        href: DOCS_LINK_WM_MOVEMENT
    },
    // {
    //     capture: 'Анализ',
    //     href: DOCS_LINK_WM_ANALYSIS
    // },
]