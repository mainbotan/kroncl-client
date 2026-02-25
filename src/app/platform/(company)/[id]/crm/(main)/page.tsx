'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams } from 'next/navigation';
import { sectionsList } from '../_sections';
import { ClientCard } from '../components/client-card/card';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <>
        <PlatformHead 
            title='CRM'
            description='Управление клиентской базой.'
            sections={sectionsList(companyId)}
            showSearch={true}
        />
        <div className={styles.grid}>
            <ClientCard />
            <ClientCard />
            <ClientCard />
            <ClientCard />
            <ClientCard />
            <ClientCard />
        </div>
        </>
    )
}