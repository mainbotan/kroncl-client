'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useSideContent } from "@/app/platform/components/side-content/context";
import Plus from "@/assets/ui-kit/icons/plus";

export default function SomePage() {
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
    />
    </>
  );
}