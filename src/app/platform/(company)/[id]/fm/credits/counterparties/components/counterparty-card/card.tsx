'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import Button, { ButtonProps } from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import { useParams } from 'next/navigation';
import { Counterparty, CounterpartyType, CounterpartyStatus } from '@/apps/company/modules/fm/types';
import { getColorFromString, getFirstLetter, getGradientFromString } from '@/assets/utils/avatars';

interface CounterpartyCardProps {
    counterparty: Counterparty;
    showDefaultActions?: boolean;
    actions?: ButtonProps[];
    className?: string;
}

const typeLabels: Record<CounterpartyType, string> = {
    bank: 'Банк',
    organization: 'Организация',
    person: 'Физлицо'
};

const statusLabels: Record<CounterpartyStatus, string> = {
    active: 'Активный',
    inactive: 'Неактивный'
};

const statusTooltips: Record<CounterpartyStatus, string> = {
    active: 'Контрагент активен',
    inactive: 'Контрагент деактивирован'
};

const roleLabels: Record<string, string> = {
    lender: 'Кредитор',
    borrower: 'Дебитор'
};

export function CounterpartyCard({
    counterparty,
    showDefaultActions = true,
    actions,
    className
}: CounterpartyCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    const avatarGradient = getColorFromString(counterparty.name);
    const initials = getFirstLetter(counterparty.name);

    // Определяем роль из metadata если есть
    const role = counterparty.metadata?.role as 'lender' | 'borrower' | undefined;

    return (
        <div className={clsx(styles.card, className)}>
            <div 
                className={styles.icon}
                style={{ background: avatarGradient }}
            >
                {initials}
            </div>
            <div className={styles.info}>
                <div className={styles.name}>{counterparty.name}</div>
                {counterparty.comment && (
                    <div className={styles.comment}>{counterparty.comment}</div>
                )}
                <div className={styles.tags}>
                    {role && (
                        <ModalTooltip content={role === 'lender' ? 'Даёт в долг/кредит' : 'Берёт в долг/кредит'}>
                            <span className={clsx(styles.tag, styles.accent)}>
                                {roleLabels[role]}
                            </span>
                        </ModalTooltip>
                    )}
                    <ModalTooltip content={statusTooltips[counterparty.status]}>
                        <span className={clsx(
                            styles.tag, 
                            counterparty.status === 'active' && styles.accent
                        )}>
                            {statusLabels[counterparty.status]}
                        </span>
                    </ModalTooltip>
                    <span className={clsx(styles.tag, styles.secondary)}>
                        {typeLabels[counterparty.type]}
                    </span>
                </div>
            </div>
            <div className={styles.actions}>
                {showDefaultActions && (
                    <Button 
                        as='link' 
                        href={`/platform/${companyId}/fm/credits/counterparties/${counterparty.id}`} 
                        className={styles.action} 
                        variant='accent'
                    >
                        Открыть
                    </Button>
                )}
                {actions?.map((action, index) => (
                    <Button key={index} className={clsx(styles.action, action.className)} {...action} />
                ))}
            </div>
        </div>
    );
}