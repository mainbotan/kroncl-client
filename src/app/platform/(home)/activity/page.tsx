import { DOCS_LINK_ACCOUNT } from "@/app/docs/(v1)/internal.config";
import { PlatformHead } from "../../components/lib/head/head";

export default function Page() {
    return (
        <PlatformHead
            title="Активность"
            description="Активность аккаунта во всех организациях за прошедшее время."
            docsEscort={{
                href: DOCS_LINK_ACCOUNT,
                title: 'Подробнее о личной учётной записи.'
            }}
        />
    )
}