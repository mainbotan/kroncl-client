import { DOCS_LINK_CRM, DOCS_LINK_DM, DOCS_LINK_FM, DOCS_LINK_HRM, DOCS_LINK_WM } from "@/app/docs/(v1)/internal.config";

export interface PricingPlanModule {
    name: string;
    docsLink?: string;
    icon?: React.ReactNode;
}

export interface PricingPlanStructure {
    lvl: number;
    modules: PricingPlanModule[];
}

export const modulesLVL3: PricingPlanModule[] = [
    { name: 'Финансы', docsLink: DOCS_LINK_FM },
    { name: 'Управление сотрудниками', docsLink: DOCS_LINK_HRM }
];

export const modulesLVL2: PricingPlanModule[] = [
    ...modulesLVL3,
    { name: 'Каталог & Склад', docsLink: DOCS_LINK_WM },
    { name: 'Клиентская база', docsLink: DOCS_LINK_CRM }
];

export const modulesLVL1: PricingPlanModule[] = [
    ...modulesLVL2,
    { name: 'Сделки', docsLink: DOCS_LINK_DM }
];

export const pricingPlansStructures: PricingPlanStructure[] = [
    {
        lvl: 1,
        modules: modulesLVL1
    },
    {
        lvl: 2,
        modules: modulesLVL2
    },
    {
        lvl: 3,
        modules: modulesLVL3
    }
]