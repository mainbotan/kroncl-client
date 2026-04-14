'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import { useParams } from 'next/navigation';
import { Position } from '@/apps/company/modules/hrm/types';

export interface PositionCardProps {
    position: Position;
    showDefaultActions?: boolean;
    actions?: ButtonProps[];
    className?: string;
    variant?: 'default' | 'compact';
}

export function PositionCard({
    position,
    showDefaultActions = true,
    actions,
    className,
    variant = 'default'
}: PositionCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <div className={clsx(styles.card, className, styles[variant])}>
            <div className={styles.info}>
                <div className={styles.name}>{position.name}</div>
                <div className={styles.description}>
                    {position.description || 'Должность сотрудников.'}
                </div>
            </div>
            <div className={styles.actions}>
                {showDefaultActions && (
                    <Button 
                        className={styles.action} 
                        as='link' 
                        variant='accent'
                        href={`/platform/${companyId}/hrm/positions/${position.id}`}>
                        Открыть
                    </Button>
                )}
                {actions?.map((action, index) => (
                    <Button key={index} className={clsx(styles.action, action.className)} {...action} />
                ))}
            </div>
            <span className={styles.flag} />
            <span className={styles.code}>{position.id}</span>
        </div>
    )
}