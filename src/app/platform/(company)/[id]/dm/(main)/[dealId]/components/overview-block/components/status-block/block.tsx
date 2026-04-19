'use client';

import clsx from 'clsx';
import styles from './block.module.scss';
import { DealStatus } from '@/apps/company/modules/dm/types';

export interface StatusBlockProps {
    className?: string;
    statuses: DealStatus[];
    currentStatusId: string | null;
    onStatusChange?: (statusId: string) => void;
}

export function StatusBlock({
    className,
    statuses,
    currentStatusId,
    onStatusChange
}: StatusBlockProps) {
    const handleClick = (statusId: string) => {
        if (onStatusChange && statusId !== currentStatusId) {
            onStatusChange(statusId);
        }
    };

    return (
        <div className={clsx(styles.container, className)}>
            {statuses.map((status) => {
                const isSelected = status.id === currentStatusId;
                return (
                    <div
                        key={status.id}
                        className={clsx(styles.status, isSelected && styles.selected, onStatusChange && styles.clickable)}
                        onClick={() => onStatusChange && handleClick(status.id)}
                    >
                        <span
                            className={styles.marker}
                            style={{ backgroundColor: status.color || 'var(--color-text-hint)' }}
                        />
                        <span className={styles.name}>{status.name}</span>
                    </div>
                );
            })}
            <span className={styles.line} />
        </div>
    )
}