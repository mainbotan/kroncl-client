import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";
import { DOCS_LINK_DM_ANALYSIS, DOCS_LINK_DM_DEALS, DOCS_LINK_DM_DEALS_CLIENT, DOCS_LINK_DM_DEALS_EMPLOYEES, DOCS_LINK_DM_DEALS_OPERATIONS, DOCS_LINK_DM_DEALS_STRUCTURE, DOCS_LINK_DM_STATUSES, DOCS_LINK_DM_TYPES } from "../internal.config";

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
                label: 'Состав',
                href: DOCS_LINK_DM_DEALS_STRUCTURE
            },
            {
                label: 'Ответственные',
                href: DOCS_LINK_DM_DEALS_EMPLOYEES
            },
            {
                label: 'Клиент',
                href: DOCS_LINK_DM_DEALS_CLIENT
            },
            {
                label: 'Финансы',
                href: DOCS_LINK_DM_DEALS_OPERATIONS
            }
        ]
    },
    {
        label: 'Анализ',
        href: DOCS_LINK_DM_ANALYSIS
    }
]