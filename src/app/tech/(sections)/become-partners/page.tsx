'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { AppCard } from './components/app-card/card';

export default function Page() {
    return (
        <>
        <PlatformHead
            title='Заявки на партнёрство'
            description='Просмотр & Управление'
            showSearch={true}
        />
        <div className={styles.grid}>
            <AppCard className={styles.item} />
        </div>
        </>
    )
}