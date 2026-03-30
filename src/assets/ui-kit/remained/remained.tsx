import clsx from 'clsx';
import styles from './remained.module.scss';

export interface RemainedProps {
    className?: string;
    children?: React.ReactNode;
    value: number;
    limit: number;
}

export function Remained({
    className,
    children,
    value,
    limit
}: RemainedProps) {
    const filledPercents = value * 100 / limit;
    return (
        <div className={clsx(styles.container, className)}>
            {children && (<div className={styles.text}>{children}</div>)}
            <div className={styles.slug}><span style={{width: `${filledPercents}%`}} className={styles.filled} /></div>
        </div>
    )
}