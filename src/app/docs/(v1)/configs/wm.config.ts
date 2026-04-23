import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";
import { DOCS_LINK_WM_CATALOG, DOCS_LINK_WM_MOVEMENT } from "../internal.config";

export const wmSections: DocsNavSectionProps[] = [
    {
        label: 'Каталог',
        href: DOCS_LINK_WM_CATALOG,
        childrens: [
            {
                label: 'Категории',
                href: DOCS_LINK_WM_CATALOG + '/categories'
            },
            {
                label: 'Товарные позиции',
                href: DOCS_LINK_WM_CATALOG + '/positions'
            }
        ]
    },
    {
        label: 'Движение товаров',
        href: DOCS_LINK_WM_MOVEMENT,
        childrens: [
            {
                label: 'Типы складского учёта',
                href: DOCS_LINK_WM_MOVEMENT + '/types'
            },
            {
                label: 'Поставки & Отгрузки',
                href: DOCS_LINK_WM_MOVEMENT + '/batches'
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