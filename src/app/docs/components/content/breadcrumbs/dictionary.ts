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
    'fm': 'Финансы',
    'wm': 'Каталог & Склад',
    'crm': "Клиентская база",
    'dm': 'Управление сделками'
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