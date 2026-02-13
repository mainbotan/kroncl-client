import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function GradientBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
            <span className={styles.col} />
        </div>
    )
}