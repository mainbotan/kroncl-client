export const breadcrumbDictionary: Record<string, string> = {
    'platform': 'Платформа',
    'account': 'Аккаунт',
    'companies': "Организации",
    'company': "Компания",
    'settings': "Настройки",

    'new': "Создание",
    'edit': "Редактирование",
    'invite': 'Пригласить',

    'storage': "Хранилище",
    'accesses': "Доступы",
    'accounts': "Аккаунты",
    'permissions': "Разрешения",
    'invitations': "Приглашения",
    'hrm': 'Сотрудники',
    'positions': 'Должности',
    'fm': 'Финансы',
    'categories': 'Категории',
    'new-operation': 'Новая операция'
};

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
    return '/platform' + (index > 0 ? '/' + segments.slice(0, index).join('/') : '');
}