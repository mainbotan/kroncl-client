'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import { formatDate } from '@/assets/utils/date';
import { getGradientFromString } from '@/assets/utils/avatars';
import { TransactionListItem } from '@/apps/company/modules/fm/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Button from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import { useState } from 'react';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useFm } from '@/apps/company/modules';

export interface TransactionCardProps {
    transaction: TransactionListItem;
    className?: string;
    onReverse?: () => void;
}

const currencySymbols: Record<string, string> = {
    RUB: '₽',
    KZT: '₸',
    USD: '$',
    EUR: '€'
};

export function TransactionCard({
    transaction,
    className,
    onReverse
}: TransactionCardProps) {
    const params = useParams();
    const companyId = params.id as string;
    const fmModule = useFm();
    const { showMessage } = useMessage();
    
    const {
        id,
        base_amount,
        currency,
        direction,
        comment,
        created_at,
        category_name,
        category_id,
        employee_first_name,
        employee_last_name,
        employee_id,
        reverse_to
    } = transaction;

    const formattedAmount = Math.abs(base_amount).toLocaleString('ru-RU');
    const sign = direction === 'income' ? '+' : '-';
    const symbol = currencySymbols[currency] || currency;
    
    const employeeFullName = `${employee_first_name || ''} ${employee_last_name || ''}`.trim();
    const employeeInitials = `${employee_first_name?.[0] || ''}${employee_last_name?.[0] || ''}`;
    const employeeGradient = getGradientFromString(employeeFullName || 'User');

    return (
        <>
        <div className={clsx(
            styles.transaction, 
            styles[direction],
            className
        )}>
            <div className={clsx(styles.section, styles.amount)}>
                <span className={styles.sign}>{sign}</span>
                <span className={styles.value}>{formattedAmount}</span>
                <span className={styles.symbol}>{symbol}</span>
            </div>
            
            <div className={clsx(styles.section, styles.category)}>
                {category_name ? (
                    <Link href={`/platform/${companyId}/fm/categories/${category_id}`}>{category_name}</Link>
                ) : (
                    <span className={styles.secondary}>Без категории</span>
                )}
            </div>
            
            <div className={clsx(styles.section, styles.comment)}>
                {reverse_to ? (
                    <span className={styles.tag}>Обратная операция</span>
                ) : comment ? (
                    comment
                ) : (
                    <span className={styles.secondary}>Без комментария</span>
                )}
            </div>
            
            <div className={clsx(styles.section, styles.employee)}>
                {employeeFullName ? (
                    <>
                        <span 
                            className={styles.avatar} 
                            style={{background: employeeGradient}}
                        >
                            {employeeInitials}
                        </span>
                        <Link href={`/platform/${companyId}/hrm/${employee_id}`} className={styles.name}>
                            {employeeFullName}
                        </Link>
                    </>
                ) : (
                    <span className={styles.secondary}>Сотрудник не указан</span>
                )}
            </div>
            
            <div className={clsx(styles.section, styles.date)}>
                {formatDate(created_at)}
            </div>

            {/* actions */}
            <div className={styles.actions}>
                <ModalTooltip side='left' content='Реверс-операция - корректировка ошибочной операции.'>
                    <Button 
                        onClick={onReverse}
                        className={styles.action} 
                        variant='accent'
                    >
                        Отменить
                    </Button>
                </ModalTooltip>
            </div>
        </div>
        </>
    );
}