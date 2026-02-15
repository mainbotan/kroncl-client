import { Tariff, TariffCardProps } from "./card/card";

export const tariffsList: TariffCardProps[] = [
    {
        variant: 'accent',
        tariff: {
            name: 'Финансист',
            trial: true,
            trial_days: 14,
            billing: [
                { period: 'annual', amount_rub: 6780 },
                { period: 'monthly', amount_rub: 565 }
            ],
            description: 'Приводим финансовую отчётность в порядок.',
            theses: [
                { marker: true, about: 'Управление персоналом' },
                { marker: false, about: 'Карты сотрудников' },
                { marker: false, about: 'Разрешения' },
                { marker: false, about: 'Приглашения в организацию' },
                { marker: true, about: 'Финансы' },
                { marker: false, about: 'Расчёт баланса' },
                { marker: false, about: 'Расчёт долговой нагрузки' },
                { marker: false, about: 'Расходы / доходы' },
                { marker: false, about: 'Категоризация финансов' },
                { marker: false, about: 'Аналитика трат / расходов' }
            ]
        }
    },
    {
        tariff: {
            name: 'Титан',
            trial: true,
            trial_days: 14,
            billing: [
                { period: 'annual', amount_rub: 17400 },
                { period: 'monthly', amount_rub: 1450 }
            ],
            description: 'Продвинутый учёт клиентов, ассортимент услуг / товаров, ресурсы брендирования организации.',
            theses: [
                { marker: true, about: 'Базовая CRM' },
                { marker: false, about: 'Учёт клиентской базы' },
                { marker: false, about: 'Источники трафика' },
                { marker: false, about: 'Аналитика спроса' },
                { marker: false, about: 'Создание сделок' },
                { marker: false, about: 'Мастер-сделки' },
                { marker: true, about: 'Склад & Ассортимент услуг' },
                { marker: false, about: 'Управление каталогом' },
                { marker: false, about: 'Назначение скидок & акций' },
                { marker: true, about: 'Брендирование' },
                { marker: false, about: 'Промо-ресурсы организации' },
            ]
        }
    },
    {
        tariff: {
            name: 'Стоик',
            trial: true,
            trial_days: 14,
            billing: [
                { period: 'annual', amount_rub: 57600 },
                { period: 'monthly', amount_rub: 4800 }
            ],
            description: 'Инструменты повторного привлечения клиентов, расширенное планирование финансов. Логистика.',
            theses: [
                { marker: true, about: 'Расширенная CRM' },
                { marker: false, about: 'Инструменты повторного привлечения' },
                { marker: true, about: 'Логистика' },
                { marker: false, about: 'Учёт отправлений & прибытий' },
                { marker: false, about: 'Планирование доставок' },
                { marker: false, about: 'Пополнение остатков на складе' },
                { marker: true, about: 'Расширенные настройки доступа' },
                { marker: true, about: 'Сценарный анализ финансов' },
            ]
        }
    },
]