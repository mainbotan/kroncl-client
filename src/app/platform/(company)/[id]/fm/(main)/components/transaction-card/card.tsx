'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import { formatDate } from '@/assets/utils/date';
import { getGradientFromString } from '@/assets/utils/avatars';
import { TransactionListItem } from '@/apps/company/modules/fm/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export interface TransactionCardProps {
    transaction: TransactionListItem;
    className?: string;
}

const currencySymbols: Record<string, string> = {
    RUB: '₽',
    KZT: '₸',
    USD: '$',
    EUR: '€'
};

export function TransactionCard({
    transaction,
    className
}: TransactionCardProps) {
    const params = useParams();
    const companyId = params.id as string;
    const {
        base_amount,
        currency,
        direction,
        comment,
        created_at,
        category_name,
        employee_first_name,
        employee_last_name
    } = transaction;

    const formattedAmount = Math.abs(base_amount).toLocaleString('ru-RU');
    const sign = direction === 'income' ? '+' : '-';
    const symbol = currencySymbols[currency] || currency;
    
    const employeeFullName = `${employee_first_name || ''} ${employee_last_name || ''}`.trim();
    const employeeInitials = `${employee_first_name?.[0] || ''}${employee_last_name?.[0] || ''}`;
    const employeeGradient = getGradientFromString(employeeFullName || 'User');
    
    return (
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
                    <Link href={`/platform/${companyId}/fm/categories/${transaction.category_id}`}>{category_name}</Link>
                ) : (
                    <span className={styles.secondary}>Без категории</span>
                )}
            </div>
            
            <div className={clsx(styles.section, styles.comment)}>
                {comment ? (
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
                        <Link href={`/platform/${companyId}/hrm/${transaction.employee_id}`} className={styles.name}>{employeeFullName}</Link>
                    </>
                ) : (
                    <span className={styles.secondary}>Сотрудник не указан</span>
                )}
            </div>
            
            <div className={clsx(styles.section, styles.date)}>
                {formatDate(created_at)}
            </div>
        </div>
    );
}