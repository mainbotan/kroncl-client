import { PlatformFormVariantOption } from "@/app/platform/components/lib/form/_types";

export const categoryDirections: PlatformFormVariantOption[] = [
    {
        value: 'expense',
        label: 'Расход',
        description: 'Затраты, выплаты, списания',
        // icon: <Expense />
    },
    {
        value: 'income',
        label: 'Доход',
        description: 'Поступления, продажи, прибыль',
        // icon: <Income />
    }
];