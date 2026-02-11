'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import { formatDate } from '@/assets/utils/date';
import { Employee } from '@/apps/company/modules/hrm/types';
import { getGradientFromString } from '@/assets/utils/avatars';

export interface TransactionProps {
    amount: number;
    currency: 'ru' | 'kz' | 'us' | 'ea';
    direction: 'minus' | 'plus';
    date: string;
    comment?: string;
    category?: string;
    employee: Employee;
    className?: string;
}

const currencySymbols = {
    ru: '₽',
    kz: '₸',
    us: '$',
    ea: '€'
} as const;

export function TransactionCard({
    amount,
    direction,
    currency,
    date,
    comment,
    category,
    employee,
    className
}: TransactionProps) {
    const formattedAmount = Math.abs(amount).toLocaleString('ru-RU');
    const sign = direction === 'plus' ? '+' : '-';
    const symbol = currencySymbols[currency];
    const employeeFullName = `${employee.first_name} ${employee.last_name ? employee.last_name : ''}`;
    const employeeInitials = `${employee.first_name[0]}${employee.last_name ?  employee.last_name[0] : ''}`;
    const employeeGradient = getGradientFromString(employeeFullName);
    
    return (
        <div className={clsx(styles.transaction, styles[direction], className)}>
            <div className={clsx(styles.section, styles.amount)}>
                <span className={styles.sign}>{sign}</span>
                <span className={styles.value}>{formattedAmount}</span>
                <span className={styles.symbol}>{symbol}</span>
            </div>
            <div className={clsx(styles.section, styles.category)}>
                {category ? (category) : (<span className={styles.secondary}>Без категории</span>)}
            </div>
            <div className={clsx(styles.section, styles.comment)}>
                {comment ? (comment) : (<span className={styles.secondary}>Без комментария</span>)}
            </div>
            <div className={clsx(styles.section, styles.employee)}>
                <span className={styles.avatar} style={{background: `${employeeGradient}`}}>{employeeInitials}</span>
                <span className={styles.name}>{employeeFullName}</span>
            </div>
            <div className={clsx(styles.section, styles.date)}>{formatDate(date)}</div>
        </div>
    );
}