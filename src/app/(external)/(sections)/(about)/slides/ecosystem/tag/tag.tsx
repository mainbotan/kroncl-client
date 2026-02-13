import clsx from 'clsx';
import styles from './tag.module.scss';

export interface EcosystemTag {
    label: string;
    className?: string;
}

export function Tag({
    label,
    className
}: EcosystemTag) {
    return (
        <div className={clsx(styles.tag, className)}>{label}</div>
    )
}