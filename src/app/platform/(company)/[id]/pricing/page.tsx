import { DOCS_LINK_COMPANIES_PRICING } from "@/app/docs/(v1)/internal.config";
import { PlatformHead } from "@/app/platform/components/lib/head/head";

export default function Page() {
    return (
        <>
        <PlatformHead
            title='Тарификация организации'
            description="Смена тарифного плана. Просмотр остатка дней."
            docsEscort={{
                href: DOCS_LINK_COMPANIES_PRICING,
                title: 'Подробнее о тарификации организации.'
            }}
        />
        </>
    )
}