import { QuickLink } from "@/app/(external)/components/quick-links/quick-links";
import { DOCS_LINK, DOCS_LINK_COMPANIES, DOCS_LINK_COMPANIES_LOGS, DOCS_LINK_COMPANIES_PRICING, DOCS_LINK_COMPANIES_STORAGE, DOCS_LINK_DM, DOCS_LINK_DM_ANALYSIS, DOCS_LINK_DM_DEALS, DOCS_LINK_DM_STATUSES, DOCS_LINK_DM_TYPES, DOCS_LINK_MODULES } from "@/app/docs/(v1)/internal.config";

export const linksList: QuickLink[] = [
    {
        capture: 'Начало работы',
        href: DOCS_LINK_COMPANIES
    },
    {
        capture: 'Мониторинг активности',
        href: DOCS_LINK_COMPANIES_LOGS
    }
]