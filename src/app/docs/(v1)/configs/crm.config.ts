import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";
import { DOCS_LINK_CRM_ANALYSIS, DOCS_LINK_CRM_CLIENTS, DOCS_LINK_CRM_SOURCES } from "../internal.config";

export const crmSections: DocsNavSectionProps[] = [
    {
        label: 'Источники',
        href: DOCS_LINK_CRM_SOURCES
    },
    {
        label: 'Клиенты',
        href: DOCS_LINK_CRM_CLIENTS
    },
    {
        label: 'Анализ',
        href: DOCS_LINK_CRM_ANALYSIS
    }
]