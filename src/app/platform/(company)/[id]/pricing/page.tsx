import { DOCS_LINK_COMPANIES_PRICING } from "@/app/docs/(v1)/internal.config";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import styles from './page.module.scss';
import { PricingPlan } from "@/app/platform/(home)/companies/new/components/pricing-plan/card";
import clsx from "clsx";

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
        <div className={styles.grid}>
            <PricingPlan className={clsx(styles.item, styles.selected)} />
            <PricingPlan className={styles.item} />
            <PricingPlan className={styles.item} />
        </div>
        </>
    )
}