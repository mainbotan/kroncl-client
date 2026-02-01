import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { PlatformPagination } from "@/app/platform/components/lib/pagination/pagination";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <>
            <PlatformHead
            title="Ваши организации"
            description="Компании, к которым вы имеете доступ, собраны здесь – перемещайтесь между учетными системами нескольких организаций без задержек."
            actions={[
                {
                label: 'Создать',
                href: '/platform/companies/new',
                variant: 'contrast' as const
                }
            ]}
            sections={[
                {
                    label: 'Все',
                    value: 'all',
                    href: '/platform/companies?role=all',
                    disabled: false
                },
                {
                    label: 'Владеете',
                    value: 'owner',
                    href: '/platform/companies?role=owner',
                    disabled: false
                },
                {
                    label: 'Приглашены',
                    value: 'joined',
                    href: '/platform/companies?role=guest',
                    disabled: false
                }
            ]}
            />
            {children}
        </>
    )
}