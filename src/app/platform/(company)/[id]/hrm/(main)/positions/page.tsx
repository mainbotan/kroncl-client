'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { sections } from '../_sections';
import Plus from '@/assets/ui-kit/icons/plus';
import { PositionCard } from '../../components/position-card/card';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <>
        <PlatformHead
            title='Должности'
            description='Настройка должностей сотрудников.'
            sections={sections(companyId)}
            actions={[
                {
                    children: 'Новая должность',
                    icon: <Plus />,
                    variant: 'accent',
                    href: `/platform/${companyId}/hrm/positions/new`
                }
            ]}
        />
        <div className={styles.grid}>
            <PositionCard />
        </div>
        </>
    )
}