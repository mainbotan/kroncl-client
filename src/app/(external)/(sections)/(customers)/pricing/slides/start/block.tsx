import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function StartBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.capture}><span className={styles.accent}>Дешевле,</span> чем вы думаете.</div>
            <div className={styles.topic}>Ценовая политика.</div>

        </div>
    )
}