import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function MultitenantBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <img src='/images/promo/light-companies.png' className={styles.mockUp} />
        </div>
    );
}