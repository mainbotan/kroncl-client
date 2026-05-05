import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
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

export default function Page() {
    return (
        <>
        {/* <PlatformHead
            title='Состояние облака'
            description='Метрики'
        /> */}
        <div className={styles.grid}>
            {/* <Counter value='100' legend='МБ. Общий размер инстанса базы' className={styles.col} />
            <Counter variant='critical' value={40} legend='Активных хранилищ (схем)' className={styles.col} />
            <Counter value={50} legend='Активных компаний' className={styles.col} />
            <Counter value={100} legend='Аккаунтов' className={styles.col} />
            <Counter variant='good' value='+20' legend='Компаний за последние 24 часа' className={styles.col} /> */}
        </div>
        </>
    )
}