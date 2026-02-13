import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { desc } from 'framer-motion/client';
import React from 'react';

export type TesisProps = Tesis & PageBlockProps;
export type Tesis = {
    capture?: string;
    description?: React.ReactNode;
}

export function ThesisBlock({
    className,
    capture,
    description
}: TesisProps) {
    return (
        <div className={clsx(styles.block, className)}>
            {capture && (<div className={styles.capture}>{capture}</div>)}
            {description && (<div className={styles.description}>{description}</div>)}
        </div>
    )
}