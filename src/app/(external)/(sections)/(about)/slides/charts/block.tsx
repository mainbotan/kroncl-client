'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { DailyChart } from '@/app/platform/(company)/[id]/fm/e2e/components/daily-chart/chart';
import { dailyStat } from './_data';

export function ChartsBlock({className}: PageBlockProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <DailyChart 
                data={dailyStat}
                loading={false}
                className={styles.chart} />
        </div>
    )
}