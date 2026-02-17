'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import Plus from '@/assets/ui-kit/icons/plus';
import { useParams } from 'next/navigation';
import { sectionsList } from '../_sections';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <>
        <PlatformHead
            title='Долговые обязательства'
            description='Контроль просроченных платежей, база контрагентов (дебиторы/кредиторы), оценка кредитоспособности.'
            actions={[
                {
                    variant: 'glass',
                    children: 'Дали в долг'
                },
                {
                    icon: <Plus />,
                    variant: 'accent',
                    children: 'Взяли в долг'
                }
            ]}
            sections={sectionsList(companyId)}
        />
        <div className={styles.grid}>

        </div>
        </>
    )
}