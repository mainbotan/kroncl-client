'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection } from '@/app/platform/components/lib/form';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { MasterPositionsBlock } from '../components/master-positions/block';

export default function Page() {
    return (
        <>
            <PlatformHead
                title='Создание поставки'
                description="Создание поставки/открузки товаров."
            />
            <PlatformFormBody>
                <PlatformFormSection title='Состав поставки'>
                    <MasterPositionsBlock className={styles.masterPositions} />
                </PlatformFormSection>
                <PlatformFormSection title='Комментарий'>
                    <PlatformFormInput
                        type='text'
                    />
                </PlatformFormSection>
            </PlatformFormBody>
        </>
    )
}