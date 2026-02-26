'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClientSource } from '@/apps/company/modules/crm/types';

interface SourceCardProps {
    source: ClientSource;
    isSelected?: boolean;
    onSelect?: (source: ClientSource) => void;
    selectable?: boolean;
}

export function SourceCard({ 
    source, 
    isSelected, 
    onSelect,
    selectable = false 
}: SourceCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const typeLabel = {
        'organic': 'Органический',
        'social': 'Социальная сеть',
        'referral': 'Реферальный',
        'paid': 'Платный',
        'email': 'Email',
        'other': 'Другое'
    }[source.type] || source.type;

    const handleClick = (e: React.MouseEvent) => {
        if (selectable && onSelect) {
            e.preventDefault();
            onSelect(source);
        }
    };

    const cardContent = (
        <div className={styles.info}>
            <div className={styles.name}>{source.name}</div>
            {source.comment && (
                <div className={styles.comment}>{source.comment}</div>
            )}
            <div className={styles.tags}>
                {source.system && (
                    <ModalTooltip content='Системный источник - удалить или обновить невозможно'>
                        <span className={clsx(styles.tag, styles.accent)}>Системный источник</span>
                    </ModalTooltip>
                )}
                <span className={clsx(styles.tag, !source.system && styles[source.type])}>
                    {typeLabel}
                </span>
                {source.url && (
                    <ModalTooltip content={source.url}>
                        <span className={styles.tag}>🔗 URL</span>
                    </ModalTooltip>
                )}
                {source.status === 'inactive' && (
                    <span className={clsx(styles.tag, styles.inactive)}>Неактивен</span>
                )}
            </div>
        </div>
    );

    if (selectable) {
        return (
            <div 
                className={clsx(styles.card, isSelected && styles.selected)}
                onClick={handleClick}
            >
                {cardContent}
            </div>
        );
    }

    return (
        <Link href={`/platform/${companyId}/crm/sources/${source.id}`} className={clsx(styles.card, isSelected && styles.selected)}>
            {cardContent}
        </Link>
    );
}