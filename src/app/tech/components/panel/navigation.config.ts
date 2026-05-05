import { TechPanelSectionProps } from "./panel";

export interface TechSectionsGroup {
    capture?: string;
    sections: TechPanelSectionProps[];
}

export const sectionsList: TechSectionsGroup[] = [
    {
        capture: 'Главное',
        sections: [
            {
                title: 'База данных',
                href: '/tech/db',
            },
            {
                title: 'Аккаунты',
                href: '/tech/accounts'
            },
            {
                title: 'Организации',
                href: '/tech/companies',
            },
            {
                title: 'Клиентура',
                href: '/tech/clientele',
                label: 'Метрики'
            },
        ]
    },
    {
        capture: 'Взаимодействие',
        sections: [
            {
                title: 'Поддержка',
                label: '23',
                href: '/tech/support'
            },
            {
                title: 'Заявки на партнёрство',
                href: '/tech/become-partners',
            }
        ]
    },
    {
        capture: 'Библия',
        sections: [
            {
                title: 'Backend',
                href: '/tech/guidelines/backend',
                exact: true,
            },
            {
                title: 'Frontend',
                href: '/tech/guidelines/frontend',
            }
        ]
    },
    {
        capture: 'Github',
        sections: [
            {
                title: 'Kroncl',
                href: 'https://github.com/Kroncl'
            },
            {
                title: 'kroncl-server',
                href: 'https://github.com/Kroncl/kroncl-server'
            },
            {
                title: 'kroncl-client',
                href: 'https://github.com/Kroncl/kroncl-client',
            }
        ]
    }
]