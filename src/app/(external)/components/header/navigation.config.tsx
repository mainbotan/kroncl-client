import Clients from "@/assets/ui-kit/icons/clients";
import Code from "@/assets/ui-kit/icons/code";
import History from "@/assets/ui-kit/icons/history";
import Kanban from "@/assets/ui-kit/icons/kanban";
import Keyhole from "@/assets/ui-kit/icons/keyhole";
import Team from "@/assets/ui-kit/icons/team";
import TwoCards from "@/assets/ui-kit/icons/two-cards";
import Upload from "@/assets/ui-kit/icons/upload";
import Wallet from "@/assets/ui-kit/icons/wallet";
import { NavigationSection } from "@/assets/utils/sections";

export interface NavigationSubItem extends NavigationSection {
    name: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
}

export interface NavigationItem extends NavigationSection {
    name: string;
    out: boolean;
    href: string;
    subItems?: NavigationSubItem[];
};

export const navigationConfig: NavigationItem[] = [
    {
        name: 'Продукт',
        href: '/',
        exact: true,
        out: false,
        subItems: [
            { name: 'Сделки', href: '/dm', icon: <Kanban /> },
            { name: 'Финансы', href: '/fm', icon: <Wallet /> },
            { name: 'CRM', href: '/crm', icon: <Clients /> },
            { name: 'Сотрудники', href: '/hrm', icon: <Team /> },
            { name: 'Каталог & Склад', href: '/wm', icon: <TwoCards /> },
            { name: 'Активность', href: '/activity', icon: <History /> },
            { name: 'Хранилище', href: '/storage', icon: <Upload /> },
            { name: 'Безопасность', href: '/security', icon: <Keyhole /> },
        ]
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
        name: 'Документация',
        href: '/docs',
        out: true,
    },
    {
        name: 'Разработчикам',
        href: 'dev',
        out: false,
    }
];