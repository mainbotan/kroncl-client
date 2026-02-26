import { SourceType } from "@/apps/company/modules/crm/types";

export function getSourceTypeLabel(type: SourceType): string {
    const labels: Record<SourceType, string> = {
        'organic': 'Органический',
        'social': 'Социальная сеть',
        'referral': 'Реферальный',
        'paid': 'Платный',
        'email': 'Email',
        'other': 'Другое'
    };
    return labels[type] || type;
}