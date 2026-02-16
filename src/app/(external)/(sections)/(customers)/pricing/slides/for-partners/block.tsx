import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function ForPartnersBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block)}>
            <div className={clsx(styles.col, className)}>
                
            </div>
            <div className={clsx(styles.col, className)}>

            </div>
        </div>
    )
}