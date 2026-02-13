// navigation.config.ts
import { NavigationSection } from "@/assets/utils/sections";
import { linksConfig } from "@/config/links.config";

export interface NavigationItem extends NavigationSection {
    name: string;
    out: boolean;
    href: string;
};

export const navigationConfig: NavigationItem[] = [
    {
        name: 'Продукт',
        href: '/product',
        out: false,
    },
    {
        name: 'Предпринимателям',
        href: '/businessmans',
        out: false,
    },
    {
        name: 'Тарифы',
        href: '/pricing',
        out: false,
    },
    {
        name: 'Помощь',
        href: '/support',
        out: false,
    },
    {
        name: 'Разработчикам',
        href: linksConfig.developerPortal,
        out: true,
    }
];