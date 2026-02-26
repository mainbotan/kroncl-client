import { Client } from '@/apps/company/modules/crm/types';

export function getFullName(client: Client): string {
    const parts = [client.first_name];
    if (client.last_name) parts.push(client.last_name);
    if (client.patronymic) parts.push(client.patronymic);
    return parts.join(' ');
}

export function getClientTypeLabel(type: string): string {
    return type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо';
}