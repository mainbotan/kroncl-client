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
import { HRMSummaryWidget } from "../hrm/widgets/hrm-summary-widget/widget";
import { CRMSummaryWidget } from "../crm/widgets/crm-summary-widget/widget";
import { FMDynamicsWidget } from "../fm/widgets/fm-dymanics-widget/widget";
import clsx from "clsx";
import { CRMDynamicsWidget } from "../crm/widgets/crm-dynamics-widget/widget";
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { DMSummaryWidget } from "../dm/widgets/dm-summary-widget/widget";
import { DMDynamicsWidget } from "../dm/widgets/dm-dynamics-widget/widget";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    
    const ALLOW_FM_ANALYSIS = usePermission(PERMISSIONS.FM_ANALYSIS)
    const ALLOW_CRM_ANALYSIS = usePermission(PERMISSIONS.CRM_ANALYSIS)
    const ALLOW_HRM_ANALYSIS = usePermission(PERMISSIONS.HRM_ANALYSIS)
    const ALLOW_DM_ANALYSIS = usePermission(PERMISSIONS.DM_ANALYSIS)
    const ALLOW_STORAGE_SOURCES = usePermission(PERMISSIONS.STORAGE_SOURCES)
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
            <PricingWidget className={styles.item} />
            {isAllowed(ALLOW_FM_ANALYSIS) && (
                <>
                <FMSummaryWidget className={styles.item} />
                <FMDynamicsWidget className={clsx(styles.item, styles.large)} />
                </>
            )}
            {isAllowed(ALLOW_DM_ANALYSIS) && (
                <>
                <DMSummaryWidget className={styles.item} />
                <DMDynamicsWidget className={clsx(styles.item, styles.large)} />
                </>
            )}
            {isAllowed(ALLOW_CRM_ANALYSIS) && (
                <>
                <CRMSummaryWidget className={styles.item} />
                <CRMDynamicsWidget className={clsx(styles.item, styles.large)} />
                </>
            )}
            {isAllowed(ALLOW_HRM_ANALYSIS) && (
                <>
                <HRMSummaryWidget className={styles.item} />
                </>
            )}
            {isAllowed(ALLOW_STORAGE_SOURCES) && (
                <StorageWidget className={styles.item} />
            )}
        </div>
        </>
    )
}