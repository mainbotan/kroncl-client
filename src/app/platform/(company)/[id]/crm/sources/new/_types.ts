import { SourceType } from "@/apps/company/modules/crm/types";

export const sourceTypes: { value: SourceType; label: string; description?: string }[] = [
    {
        value: 'organic',
        label: 'Органический',
        description: 'Прямые заходы, поисковые системы'
    },
    {
        value: 'social',
        label: 'Социальные сети',
        description: 'Instagram, VK, Telegram, Facebook'
    },
    {
        value: 'referral',
        label: 'Реферальный',
        description: 'Рекомендации, партнёрские программы'
    },
    {
        value: 'paid',
        label: 'Платный трафик',
        description: 'Контекстная реклама, таргет'
    },
    {
        value: 'email',
        label: 'Email рассылки',
        description: 'Почтовые кампании'
    },
    {
        value: 'other',
        label: 'Другое',
        description: 'Прочие источники'
    }
];