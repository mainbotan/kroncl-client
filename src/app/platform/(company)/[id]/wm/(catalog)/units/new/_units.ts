export interface Unit {
    value: string;
    label: string;
    description?: string;
}

export const _units: Unit[] = [
    { value: 'pcs', label: 'Штука (pcs)' },
    { value: 'kg', label: 'Килограмм (кг)' },
    { value: 'g', label: 'Грамм (г)' },
    { value: 'l', label: 'Литр (л)' },
    { value: 'ml', label: 'Миллилитр (мл)' },
    { value: 'm', label: 'Метр (м)' },
    { value: 'cm', label: 'Сантиметр (см)' },
    { value: 'hour', label: 'Час', description: 'Для почасовых услуг' },
    { value: 'day', label: 'День', description: 'Для услуг с посуточной оплатой' },
    { value: 'month', label: 'Месяц', description: 'Для услуг с помесячной оплатой' },
    { value: 'service', label: 'Услуга (ед.)', description: 'Разовая услуга' }
];