'use client';

import { PlatformHeadAction, PlatformHeadNote, PlatformHeadSection } from "@/app/platform/components/lib/head/_types";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useCompany } from "@/apps/company/provider";
import Plus from "@/assets/ui-kit/icons/plus";

export default function Page() {
    const { company } = useCompany();

    const sections: PlatformHeadSection[] = [
        {
            label: 'Все клиенты',
            value: 'crm',
            href: `/platform/${company.id}/crm`,
            disabled: false
        },
        {
            label: 'Статистика',
            value: 'analyse',
            href: `/platform/${company.id}/crm/analyse`,
            disabled: false
        }
    ];

    const actions: PlatformHeadAction[] = [
        {
            label: 'Новый клиент',
            icon: <Plus />,
            variant: 'accent'
        }
    ]

    return (
        <>
            <PlatformHead 
                title="Клиенты"
                description="Управление клиентской базой."
                sections={sections}
                actions={actions}
            />
        </>
    );
}
