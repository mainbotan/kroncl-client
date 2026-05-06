'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './layout.module.scss';
import { TicketCard } from './components/ticket-card/card';

export default function Page() {
    return (
        <>
        <PlatformHead
            title='Тикеты компаний'
            description='Созданные компаниями тикеты в техническую поддержку.'
            showSearch={true}
        />
        <div className={styles.grid}>
            <TicketCard className={styles.item} />
            <TicketCard className={styles.item} />
            <TicketCard className={styles.item} />
            <TicketCard className={styles.item} />
        </div>
        </>
    )
}