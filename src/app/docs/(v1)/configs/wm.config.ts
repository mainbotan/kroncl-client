import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";
import { DOCS_LINK_WM_CATALOG, DOCS_LINK_WM_CATALOG_CATEGORIES, DOCS_LINK_WM_CATALOG_UNITS, DOCS_LINK_WM_MOVEMENT, DOCS_LINK_WM_MOVEMENT_BATCHES, DOCS_LINK_WM_MOVEMENT_TYPES } from "../internal.config";

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
        href: DOCS_LINK_WM_MOVEMENT,
        childrens: [
            {
                label: 'Типы складского учёта',
                href: DOCS_LINK_WM_MOVEMENT_TYPES
            },
            {
                label: 'Поставки & Отгрузки',
                href: DOCS_LINK_WM_MOVEMENT_BATCHES
            }
        ]
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