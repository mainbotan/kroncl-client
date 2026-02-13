import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export interface StatisticsBlockProps extends PageBlockProps {
    value: string;
    legend: string;
}

export function StatisticsBlock({
    value,
    legend,
    className
}: StatisticsBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.value}>{value}</div>
            <div className={styles.legend}>{legend}</div>
        </div>
    )
}