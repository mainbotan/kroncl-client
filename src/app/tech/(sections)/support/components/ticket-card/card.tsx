'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Link from 'next/link';
import Button from '@/assets/ui-kit/button/button';

export interface TicketCardProps {
    className?: string
}

export function TicketCard({
    className
}: TicketCardProps) {
    return (
        <Link href={`/tech/support/0x`} className={clsx(styles.container, className)}>
            <div className={styles.icon}>М</div>
            <div className={styles.info}>
                <div className={styles.name}><span className={styles.secondary}>Тикет</span> #9292</div>
                <div className={styles.message}>
                    Сегодня я хочу рассказать про то, как гетеросексуальный бэкендер (до этого момента коим я себя в той или иной степени считал) переживает болезненный опыт построения клиентской части платформы. Ради интереса недавно я посмотрел, сколько примерно строк на данный момент насчитывает репозиторий фронтенда Kroncl (название платформы), и приятно удивился числу 70.
                </div>
                <div className={styles.meta}>
                    Создан 5 мая, 2026 | Без ответа | Специалист не назначен
                </div>
            </div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag, styles.accent)}>Ожидает</span>
            </div>
            <div className={styles.actions}>
                <Button 
                    variant='glass'
                    children='Взять в обработку'
                    className={styles.action}
                />
            </div>
        </Link>
    )
}