'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Link from 'next/link';
import Button from '@/assets/ui-kit/button/button';
import { AdminTicket } from '@/apps/admin/support/types';
import { getColorFromString, getFirstLetter } from '@/assets/utils/avatars';
import { formatDate } from '@/assets/utils/date';
import { shortenId } from '@/assets/utils/ids';

export interface TicketCardProps {
    className?: string;
    ticket: AdminTicket;
}

export function TicketCard({
    className,
    ticket
}: TicketCardProps) {
    const firstLetter = getFirstLetter(ticket.company.name);
    const avatarColor = getColorFromString(ticket.company.name);

    return (
        <Link href={`/tech/support/${ticket.id}`} className={clsx(styles.container, className)}>
            <div style={{background: `${avatarColor}`}} className={styles.icon}>{firstLetter}</div>
            <div className={styles.info}>
                <div className={styles.name}><span className={styles.secondary}>Тикет</span> #{shortenId(ticket.id)}</div>
                <div className={clsx(styles.message, !ticket.last_message?.is_tech && styles.primary)}>
                    {ticket.last_message?.text}
                </div>
                <div className={styles.meta}>
                    Создан {formatDate(ticket.created_at)} | {ticket.last_message?.is_tech ? 'Ответ дан' : 'Ждёт ответа'} | {ticket.assigned_admin_id ? 'Админ назначен' : 'Ждёт админа'}
                </div>
            </div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag, ticket.status === 'pending' ? styles.accent : styles.normal)}>{ticket.status}</span>
            </div>
            {/* <div className={styles.actions}>
                <Button 
                    variant='glass'
                    children='Взять в обработку'
                    className={styles.action}
                />
            </div> */}
        </Link>
    )
}