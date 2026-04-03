'use client';

import clsx from "clsx";
import styles from './panel.module.scss';
import Button from "@/assets/ui-kit/button/button";
import Edit from "@/assets/ui-kit/icons/edit";
import { TicketCard } from "../ticket-card/card";
import { useParams } from "next/navigation";
import { useSupport } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { Ticket } from '@/apps/company/modules/support/types';
import { PlatformEmptyCanvas } from "@/app/platform/components/lib/empty-canvas/canvas";
import Support from "@/assets/ui-kit/icons/support";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { supportEvents } from "@/apps/company/modules/support/events";

export interface PanelProps {
    className?: string;
}

export function Panel({
    className
}: PanelProps) {
    const params = useParams();
    const companyId = params.id as string;
    const supportModule = useSupport();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await supportModule.getTickets();
            if (response.status && response.data) {
                setTickets(response.data.tickets);
            } else {
                setError(response.message || 'Не удалось загрузить тикеты');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTickets();
        
        // Подписка на обновления
        const unsubscribe = supportEvents.subscribe(() => {
            loadTickets();
        });
        return unsubscribe;
    }, []);

    const handleUpdateTicket = (updatedTicket: Ticket) => {
        setTickets(prevTickets => 
            prevTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t)
        );
    };

    if (loading) return (
        <div className={clsx(styles.container, className)}>
            <PlatformLoading />
        </div>
    );
    if (error) return (
        <div className={clsx(styles.container, className)}>
            <PlatformError error={error} />
        </div>
    );

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.grid}>
                <div className={styles.head}>
                    <div className={styles.title}>Поддержка клиентов</div>
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
                    {!tickets ? (
                        <PlatformEmptyCanvas
                            title='Тикетов пока нет.'
                            className={styles.empty}
                            showDescription={false}
                        />
                    ) : (
                        tickets.map((ticket) => (
                            <TicketCard 
                                key={ticket.id} 
                                ticket={ticket} 
                                className={styles.item}
                                onUpdate={handleUpdateTicket}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}