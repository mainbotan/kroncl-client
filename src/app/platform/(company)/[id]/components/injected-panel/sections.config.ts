import { useMemo } from "react";
import { PanelSection } from "../../../../components/panel/_types";

export interface Section extends PanelSection {
    lvl: number;    // требуемый lvl тарифного плана
}

export const PLAN_MIN_LVL = 1;
export const PLAN_MID_LVL = 2;
export const PLAN_MAX_LVL = 3;

export function sections(companyId: string, lvl: number): Section[] {
    const all = allSections(companyId);
    return all.filter(section => section.lvl >= lvl);
}

// memo
export function useSections(companyId: string, lvl: number): Section[] {
    return useMemo(() => sections(companyId, lvl), [companyId, lvl]);
}

function allSections(companyId: string): Section[] {
    return ([
    {
        name: 'Рабочее место',
        href: `/platform/${companyId}`,
        icon: 'home',
        exact: true,
        lvl: PLAN_MAX_LVL
    },
    {
        name: 'Сделки',
        href: `/platform/${companyId}/dm`,
        icon: 'deals',
        lvl: PLAN_MIN_LVL
    },
    {
        name: 'Клиенты',
        href: `/platform/${companyId}/crm`,
        icon: 'clients',
        lvl: PLAN_MID_LVL
    },
    {
        name: 'Финансы',
        href: `/platform/${companyId}/fm`,
        icon: 'wallet',
        lvl: PLAN_MAX_LVL
    },
    {
        name: 'Каталог',
        href: `/platform/${companyId}/wm`,
        icon: 'catalog',
        lvl: PLAN_MID_LVL
    },
    {
        name: 'Сотрудники',
        href: `/platform/${companyId}/hrm`,
        icon: 'team',
        lvl: PLAN_MAX_LVL
    },
    // {
    //     name: 'Файлы',
    //     href: `/platform/${companyId}/files`,
    //     icon: 'files',
    //     lvl: PLAN_MAX_LVL
    // },
    // {
    //     name: 'Ресурсы бренда',
    //     href: `/platform/${companyId}/branding`,
    //     icon: 'branding',
    //     lvl: PLAN_MAX_LVL
    // },
    {
        name: 'Активность',
        href: `/platform/${companyId}/activity`,
        icon: 'activity',
        lvl: PLAN_MAX_LVL
    },
    {
        name: 'Доступы',
        href: `/platform/${companyId}/accounts`,
        icon: 'accesses',
        lvl: PLAN_MAX_LVL
    },
    {
        name: 'Хранилище',
        href: `/platform/${companyId}/storage`,
        icon: 'storage',
        lvl: PLAN_MAX_LVL
    },
    {
        name: 'Поддержка',
        href: `/platform/${companyId}/support`,
        icon: 'support',
        lvl: PLAN_MAX_LVL
    }
    ])
};