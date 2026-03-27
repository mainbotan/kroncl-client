import { DocsNavSectionProps } from "../../components/panel/components/nav-section/section";

export const fmSections: DocsNavSectionProps[] = [
    {
        label: 'Движение средств',
        href: '/docs/companies/modules/fm/movement-of-funds',
        childrens: [
            {
                label: 'Категории',
                href: '/docs/companies/modules/fm/movement-of-funds/categories'
            },
            {
                label: 'Операции',
                href: '/docs/companies/modules/fm/movement-of-funds/operations'
            },
            {
                label: 'Баланс предприятия',
                href: '/docs/companies/modules/fm/movement-of-funds/balance'
            },
            {
                label: 'Анализ операций',
                href: '/docs/companies/modules/fm/movement-of-funds/analysis'
            }
        ]
    },
    {
        label: 'Долговые обязательства',
        href: '/docs/companies/modules/fm/debt-obligations',
        childrens: [
            {
                label: 'Контрагенты',
                href: '/docs/companies/modules/fm/debt-obligations/counterparties'
            },
            {
                label: 'Кредиты & Дебеты',
                href: '/docs/companies/modules/fm/debt-obligations/credits-debts'
            },
        ]
    }
]