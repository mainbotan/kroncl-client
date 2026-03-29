import { DOCS_LINK_COMPANIES_ACCESSES } from "@/app/docs/(v1)/internal.config";
import { PlatformHead } from "../../components/lib/head/head";

export default function Page() {
    return (
        <PlatformHead
            title='Приглашения'
            description="Входящие и исходящие приглашения в организации."
            docsEscort={{
                href: DOCS_LINK_COMPANIES_ACCESSES,
                title: 'Подробнее о доступах к организациям.'
            }}
        />
    )
}