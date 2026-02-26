import { Client } from '@/apps/company/modules/crm/types';

export function getFullName(client: Client): string {
    const parts = [client.first_name];
    if (client.last_name) parts.push(client.last_name);
    if (client.patronymic) parts.push(client.patronymic);
    return parts.join(' ');
}

export function getInitials(client: Client): string {
    let initials = client.first_name[0] || '';
    if (client.last_name) {
        initials += client.last_name[0];
    } else if (client.patronymic) {
        initials += client.patronymic[0];
    }
    return initials.toUpperCase();
}