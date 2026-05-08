import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './counter.module.scss';
import clsx from 'clsx';

export interface CounterProps {
    className?: string;
    value: string | number;
    legend: string;
    variant?: 'good' | 'normal' | 'warning' | 'critical';
    format?: (value: string | number) => string;
}

export function Counter({
    className,
    value,
    legend,
    variant = 'normal',
    format
}: CounterProps) {
    const displayValue = format ? format(value) : value;
    
    return (
        <div className={clsx(styles.counter, className, styles[variant])}>
            <div className={styles.value}>{displayValue}</div>
            <div className={styles.legend}>{legend}</div>
        </div>
    );
}