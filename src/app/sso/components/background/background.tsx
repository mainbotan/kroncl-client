import clsx from 'clsx';
import styles from './background.module.scss';

export interface BackgroundProps {
    className?: string;
}

export function Background({
    className
}: BackgroundProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <span className={styles.arc} />
            <span className={styles.arc} />
        </div>
    )
}