'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import Plus from '@/assets/ui-kit/icons/plus';
import { useParams } from 'next/navigation';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <>
        <PlatformHead
            title='Долговые обязательства'
            description='Контролируйте каждый просроченный платёж, оценивайте кредитоспособность и расчёты по процентам.'
            actions={[
                {
                    icon: <Plus />,
                    variant: 'accent',
                    children: 'Новый долг'
                }
            ]}
            sections={[
                {
                    label: 'Главное',
                    exact: true,
                    href: `/platform/${companyId}/fm/debts`
                },
                {
                    label: 'База кредиторов',
                    href: `/platform/${companyId}/fm/debts/creditors`
                },
                {
                    label: 'Оценка рисков',
                    href: `/platform/${companyId}/fm/debts/risks`
                }
            ]}
        />
        <div className={styles.grid}>

        </div>
        </>
    )
}