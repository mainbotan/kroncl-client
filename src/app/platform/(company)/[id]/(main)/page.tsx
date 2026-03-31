'use client';

import { DOCS_LINK_COMPANIES } from "@/app/docs/(v1)/internal.config";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useParams } from "next/navigation";
import { getCompanyData } from "../layout";
import { useCompany } from "@/apps/company/provider";
import styles from './page.module.scss';
import { PricingWidget } from "../pricing/widgets/pricing-widget/widget";
import { StorageWidget } from "../storage/widgets/storage-widget/widget";
import { FMSummaryWidget } from "../fm/widgets/fm-summary-widget/widget";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    
    const companyObject = useCompany();

    return (
        <>
        <PlatformHead 
            docsEscort={{
                href: DOCS_LINK_COMPANIES,
                title: 'Начало работы с организацией.'
            }}
            childrenPosition="top"
        >
            <div className={styles.head}>
                <div className={styles.welcome}>Добрый вечер, mainbotan</div>
                <div className={styles.name}>{companyObject.company.name}</div>
            </div>
        </PlatformHead>
        <div className={styles.widgets}>
            <FMSummaryWidget variant='default' className={styles.item} />
            <PricingWidget className={styles.item} />
            <StorageWidget variant='default' className={styles.item} />
        </div>
        </>
    )
}