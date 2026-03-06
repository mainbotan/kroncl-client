'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useSideContent } from "@/app/platform/components/side-content/context";
import Plus from "@/assets/ui-kit/icons/plus";
import { useParams } from "next/navigation";
import { sectionsList } from "./_sections";

export default function SomePage() {
    const params = useParams();
    const companyId = params.id as string;
    const { openSideContent } = useSideContent();

    const handleOpenSide = () => {
        openSideContent(
            <div></div>
        );
    };

    return (
        <>
        <PlatformHead
        title='Каталог & Склад'
        description="Управление ассортиментом услуг и товаров. Контроль отстатков."
        actions={[
            {
                children: 'Создать',
                variant: 'accent',
                onClick: handleOpenSide,
                icon: <Plus />
            }
        ]}
        sections={sectionsList(companyId)}
        />
        </>
    );
}