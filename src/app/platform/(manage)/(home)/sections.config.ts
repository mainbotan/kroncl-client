import { PanelSection } from "../../components/panel/_types";

export const sectionsList = (): PanelSection[] => {
    return ([
        {
            name: 'Главная',
            href: '/platform',
            icon: 'home',
            exact: true
        },
        {
            name: 'Аккаунт',
            href: '/platform/account',
            icon: 'account'
        },
        {
            name: 'Организации',
            href: '/platform/companies',
            icon: 'collection'
        },
        {
            name: 'Приглашения',
            href: '/platform/invitations',
            icon: 'invitations'
        },
        {
            name: 'Безопасность',
            href: '/platform/security',
            icon: 'keyhole'
        },
    ]);
}