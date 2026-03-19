import { DocsNavSectionProps } from "../components/panel/components/nav-section/section";
import { crmSections } from "./configs/crm.config";
import { dmSections } from "./configs/dm.config";
import { fmSections } from "./configs/fm.config";
import { hrmSections } from "./configs/hrm.config";
import { wmSections } from "./configs/wm.config";

export const navigationSections: DocsNavSectionProps[] = [
    {
        label: 'Введение',
        href: '/docs'
    },
    {
        label: "Быстрый старт",
        href: "/docs/quick-start"
    },
    {
        label: 'Аккаунт',
        href: '/docs/account',
        childrens: [
            {
                label: 'Основные возможности',
                href: '/docs/account/overview'
            },
            // {
            //     label: 'Безопасность',
            //     href: '/docs/account/security'
            // },
            {
                label: 'Ключи доступа',
                href: '/docs/account/fingerprints'
            }
        ]
    },
    {
        label: 'Организации',
        href: '/docs/companies',
        childrens: [
            {
                label: 'Доступы',
                href: '/docs/companies/accesses',
                childrens: [
                    {
                        label: 'Разрешения',
                        href: '/docs/companies/accesses/permissions'
                    },
                ]
            },
            {
                label: 'Тарификация',
                href: '/docs/companies/pricing'
            },
            {
                label: 'Мониторинг действий',
                href: '/docs/companies/logs'
            },
            {
                label: 'Хранилище',
                href: '/docs/companies/storage'
            },
            {
                label: 'Резервные копии',
                href: '/docs/companies/backups'
            }
        ]
    },
    {
        label: 'Модули',
        href: '/docs/companies/modules',
        childrens: [
            {
                label: 'Управление персоналом',
                href: '/docs/companies/modules/hrm',
                childrens: hrmSections
            },
            {
                label: 'Финансы',
                href: '/docs/companies/modules/fm',
                childrens: fmSections
            },
            {
                label: 'Каталог & Склад',
                href: '/docs/companies/modules/wm',
                childrens: wmSections
            },
            {
                label: 'Клиентская база',
                href: '/docs/companies/modules/crm',
                childrens: crmSections
            },
            {
                label: 'Сделки',
                href: '/docs/companies/modules/dm',
                childrens: dmSections
            }
        ]
    }
];