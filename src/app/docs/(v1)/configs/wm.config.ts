import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";
import { DOCS_LINK_WM_CATALOG, DOCS_LINK_WM_CATALOG_CATEGORIES, DOCS_LINK_WM_CATALOG_UNITS, DOCS_LINK_WM_MOVEMENT } from "../internal.config";

export const wmSections: DocsNavSectionProps[] = [
    {
        label: 'Каталог',
        href: DOCS_LINK_WM_CATALOG,
        childrens: [
            {
                label: 'Категории',
                href: DOCS_LINK_WM_CATALOG_CATEGORIES
            },
            {
                label: 'Товарные позиции',
                href: DOCS_LINK_WM_CATALOG_UNITS
            }
        ]
    },
    {
        label: 'Движение товаров',
        href: DOCS_LINK_WM_MOVEMENT
    },
    // {
    //     label: 'Анализ',
    //     href: '/',
    //     childrens: [
    //         {
    //             label: 'Анализ остатков',
    //             href: '/'
    //         },
    //         {
    //             label: 'Анализ каталога',
    //             href: '/'
    //         }
    //     ]
    // }
]