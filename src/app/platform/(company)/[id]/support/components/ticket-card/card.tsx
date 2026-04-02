'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export interface TicketCardProps {
    className?: string;
}

export function TicketCard({
    className
}: TicketCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <div className={clsx(styles.card, className)}>
            <div className={styles.indicator}>
                <span className={clsx(styles.circle, styles.accent)} />
            </div>
            <Link href={`/platform/${companyId}/support/0x`} className={styles.info}>
                <div className={styles.title}>Оплата тарифа</div>
                <div className={clsx(styles.text)}>Добрый вечер, хотел послать вас нахуй заебали хуесосы бляяяяяяя</div>
                <div className={styles.date}>2 апреля, 2026</div>
            </Link>
        </div>
    )
}