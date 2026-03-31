import clsx from 'clsx';
import styles from './remained.module.scss';

export interface RemainedProps {
    className?: string;
    children?: React.ReactNode;
    value?: number;
    limit?: number;
    loading?: boolean;
}

export function Remained({
    className,
    children,
    value,
    limit,
    loading = false
}: RemainedProps) {
    let filledPercents = 0;

    if (value !== undefined && limit !== undefined && limit > 0) {
        filledPercents = (value / limit) * 100;
    }

    return (
        <div className={clsx(styles.container, className)}>
            {children && (<div className={styles.text}>{children}</div>)}
            <div className={clsx(styles.slug, loading && styles.loading)}>
                <span style={{width: `${filledPercents}%`}} className={styles.filled} />
            </div>
        </div>
    );
}