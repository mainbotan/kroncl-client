import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function StartBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            
        </div>
    )
}