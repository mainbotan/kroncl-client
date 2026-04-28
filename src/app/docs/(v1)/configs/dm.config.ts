import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";
import { DOCS_LINK_DM_ANALYSIS, DOCS_LINK_DM_DEALS, DOCS_LINK_DM_STATUSES, DOCS_LINK_DM_TYPES } from "../internal.config";

export const dmSections: DocsNavSectionProps[] = [
    {
        label: 'Статусы',
        href: DOCS_LINK_DM_STATUSES
    },
    {
        label: 'Типы',
        href: DOCS_LINK_DM_TYPES
    },
    {
        label: 'Сделки',
        href: DOCS_LINK_DM_DEALS,
        childrens: [
            {
                label: 'Создание',
                href: DOCS_LINK_DM_DEALS + '/kanban'
            },
            {
                label: 'Управление',
                href: DOCS_LINK_DM_DEALS + '/manage'
            },
            {
                label: 'Финансы',
                href: DOCS_LINK_DM_DEALS + '/finance'
            }
        ]
    },
    {
        label: 'Анализ',
        href: DOCS_LINK_DM_ANALYSIS
    }
]