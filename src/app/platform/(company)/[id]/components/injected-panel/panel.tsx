'use client';

import { useCompany } from "@/apps/company/provider";
import { useParams } from "next/navigation";
import { PLAN_MAX_LVL, sections } from "./sections.config";
import ClientPanel from "@/app/platform/components/panel/client-panel";
import { actions } from "./actions.config";

export function PlatformInjectedPanel() {
    const params = useParams();
    const companyId = params.id as string;
    const company = useCompany().company;
    const companyPlan = useCompany().companyPlan;
    const companyCurrentPlan = companyPlan?.current_plan;
    const companyLvl = companyCurrentPlan?.lvl || PLAN_MAX_LVL;

    return (
        <ClientPanel
            sections={sections(companyId, companyLvl)} 
            title={company.name} 
            actions={(companyPlan?.days_left || 0) > 0 ? actions(companyId, companyLvl) : []} 
            // children={storageWidget}
            // actions={actions}
            />
    )
}