import { TechPanelSectionProps } from "./panel";

export interface TechSectionsGroup {
    capture?: string;
    sections: TechPanelSectionProps[];
    requiredLevel: number;
}

export const sectionsList: TechSectionsGroup[] = [
    {
        capture: 'Главное',
        requiredLevel: 1,
        sections: [
            {
                title: 'Сервер',
                href: '/tech',
                exact: true,
                requiredLevel: 1
            },
            {
                title: 'База данных',
                href: '/tech/db',
                requiredLevel: 1
            },
            {
                title: 'Аккаунты',
                href: '/tech/accounts',
                requiredLevel: 2
            },
            {
                title: 'Организации',
                href: '/tech/companies',
                requiredLevel: 3
            },
            {
                title: 'Клиентура',
                href: '/tech/clientele',
                label: 'Метрики',
                requiredLevel: 4
            },
        ]
    },
    {
        capture: 'Взаимодействие',
        requiredLevel: 4,
        sections: [
            {
                title: 'Поддержка',
                href: '/tech/support',
                requiredLevel: 4
            },
            {
                title: 'Партнёры',
                href: '/tech/partners',
                requiredLevel: 4
            },
            {
                title: 'Промокоды',
                href: '/tech/promocodes',
                requiredLevel: 4
            }
        ]
    },
    {
        capture: 'Разработчикам',
        requiredLevel: 0,
        sections: [
            {
                title: 'Kroncl',
                href: 'https://github.com/Kroncl',
                requiredLevel: 0
            },
            {
                title: 'kroncl-server',
                href: 'https://github.com/Kroncl/kroncl-server',
                requiredLevel: 0
            },
            {
                title: 'kroncl-client',
                href: 'https://github.com/Kroncl/kroncl-client',
                requiredLevel: 0
            }
        ]
    }
]