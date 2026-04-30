'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function OverviewBlock({className}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <img src='/images/mock-ups/company-overview-cut.png' className={styles.mockUp} />
        </div>
    )
}