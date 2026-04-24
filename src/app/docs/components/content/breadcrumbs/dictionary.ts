export const breadcrumbDictionary: Record<string, string> = {
    'docs': 'Документация',
    'introduction': 'Введение',
    'quick-start': 'Быстрый старт',
    'account': 'Аккаунт',
    'overview': 'Обзор',
    'fingerprints': 'Ключи',
    'companies': 'Организации',
    'modules': 'Модули',
    'accesses': 'Доступы',
    'permissions': 'Разрешения',
    'pricing': 'Тарификация',
    'logs': 'Мониторинг действий',
    'storage': 'Хранилище',
    'backups': 'Резервные копии',
    'hrm': 'Управление персоналом',
    'employees': 'Сотрудники',
    'positions': 'Должности',
    'shedule': 'Рабочий график',
    'fm': 'Финансы',
    'movement-of-funds': 'Движение средств',
    'operations': 'Операции',
    'categories': 'Категории',
    'balance': 'Баланс',
    'debt-obligations': 'Долговые обязательства',
    'credits-debts': 'Кредиты & Дебиты',
    'counterparties': 'Контрагенты',
    'wm': 'Каталог & Склад',
    'crm': "Клиентская база",
    'dm': 'Управление сделками',
    'analysis': 'Анализ',
    'catalog': 'Каталог',
    'movement-products': 'Движение товаров'
}

export function getBreadcrumbName(pathSegment: string): string {
    if (breadcrumbDictionary[pathSegment.toLowerCase()]) {
        return breadcrumbDictionary[pathSegment.toLowerCase()];
    }
    if (pathSegment.startsWith('0x')) {
        return `${pathSegment.substring(0, 6)}...`;
    }
    if (/^\d+$/.test(pathSegment) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pathSegment)) {
        return `#${pathSegment.substring(0, 4)}`;
    }
    return pathSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
}
export function getBreadcrumbPath(segments: string[], index: number): string {
    return '/docs' + (index > 0 ? '/' + segments.slice(0, index).join('/') : '');
}