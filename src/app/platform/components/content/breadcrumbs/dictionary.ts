export const breadcrumbDictionary: Record<string, string> = {
    'platform': 'Платформа',
    'account': 'Аккаунт'
};

export function getBreadcrumbName(pathSegment: string): string {
    if (breadcrumbDictionary[pathSegment.toLowerCase()]) {
        return breadcrumbDictionary[pathSegment.toLowerCase()];
    }
    if (pathSegment.startsWith('0x')) {
        return `${pathSegment.substring(0, 6)}...`;
    }
    if (/^\d+$/.test(pathSegment) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pathSegment)) {
        return `#${pathSegment.substring(0, 4)}`; // cокращаем айди
    }
    return pathSegment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
}
export function getBreadcrumbPath(segments: string[], index: number): string {
    return '/platform' + (index > 0 ? '/' + segments.slice(0, index).join('/') : '');
}