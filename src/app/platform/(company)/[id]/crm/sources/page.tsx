'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { useParams } from 'next/navigation';
import { sectionsList } from '../_sections';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <>
        <PlatformHead 
            title='Ресурсы привлечения'
            description='Управление источниками трафика'
            sections={sectionsList(companyId)}
            showSearch={true}
        />
        </>
    )
}