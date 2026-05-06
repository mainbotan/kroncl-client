import { QuickLink } from "@/app/(external)/components/quick-links/quick-links";
import { DOCS_LINK, DOCS_LINK_COMPANIES, DOCS_LINK_COMPANIES_PRICING, DOCS_LINK_MODULES } from "@/app/docs/(v1)/internal.config";

export const linksList: QuickLink[] = [
    {
        capture: 'Начало работы',
        href: DOCS_LINK
    },
    {
        capture: 'Организациям',
        href: DOCS_LINK_COMPANIES
    },
    {
        capture: 'Правила тарификации',
        href: DOCS_LINK_COMPANIES_PRICING
    },
    {
        capture: 'Модули',
        href: DOCS_LINK_MODULES
    }
]