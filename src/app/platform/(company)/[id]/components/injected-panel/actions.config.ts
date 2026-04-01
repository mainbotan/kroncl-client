import { PanelAction } from "@/app/platform/components/panel/_types";
import { PLAN_MAX_LVL, PLAN_MID_LVL, PLAN_MIN_LVL } from "./sections.config";

export type Action = PanelAction & {
    lvl: number;
}

export function actions(companyId: string, lvl: number): Action[] {
    const all = allActions(companyId);
    return all.filter(action => action.lvl >= lvl);
}

function allActions(companyId: string): Action[] {
    return ([
        {
            children: "Доход",
            href: `/platform/${companyId}/fm/new-operation`,
            variant: 'accent',
            as: 'link',
            lvl: PLAN_MAX_LVL
        },
    ]);
    // return ([
    // {
    //     children: "Клиент",
    //     href: `/platform/${companyId}/crm/clients/new`,
    //     variant: 'accent',
    //     as: 'link',
    //     lvl: PLAN_MID_LVL
    // },
    // {
    //     children: "Доход",
    //     href: `/platform/${companyId}/fm/create-transaction`,
    //     variant: 'accent',
    //     as: 'link',
    //     lvl: PLAN_MAX_LVL
    // },
    // {
    //     children: "Сделка",
    //     href: `/platform/${companyId}/dm/new`,
    //     variant: 'accent',
    //     as: 'link',
    //     lvl: PLAN_MIN_LVL
    // },
    // ])
}