import clsx from 'clsx';
import styles from './block.module.scss';
import Code from '@/assets/ui-kit/icons/code';

export interface DemoBlockProps {
    className?: string;
    img: string;
    title: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
}

export function DemoBlock({
    className,
    title,
    description,
    icon,
    img
}: DemoBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.col}>
                {icon && (<div className={styles.icon}>{icon}</div>)}
                <div className={styles.title}>{title}</div>
                {description && (<div className={styles.description}>{description}</div>)}
            </div>
            <div className={styles.col}>
                <img src={img} className={styles.img} />
            </div>
        </div>
    )
}