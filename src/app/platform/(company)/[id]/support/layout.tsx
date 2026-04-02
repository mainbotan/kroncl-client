'use client';

import React from 'react';
import styles from './layout.module.scss';
import { TicketCard } from './components/ticket-card/card';
import Button from '@/assets/ui-kit/button/button';
import Edit from '@/assets/ui-kit/icons/edit';
import { useParams } from 'next/navigation';

export default function Layout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <div className={styles.grid}>
                    <div className={styles.head}>
                        <div className={styles.title}>Поддержка</div>
                        <div className={styles.actions}>
                            <Button 
                                className={styles.action} 
                                variant='contrast' 
                                icon={<Edit />} 
                                fullWidth
                                as='link'
                                href={`/platform/${companyId}/support/new`}>
                                Открыть тикет
                            </Button>
                        </div>
                    </div>
                    <div className={styles.tickets}>
                        <TicketCard className={styles.item} />
                        <TicketCard className={styles.item} />
                        <TicketCard className={styles.item} />
                    </div>
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    )
}