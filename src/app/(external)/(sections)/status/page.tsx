// app/status/page.tsx

import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('status');

import styles from './page.module.scss';
import { StartBlock } from '../(customers)/(product)/components/start/block';
import { GridBlock } from './components/grid-block/block';
import clsx from 'clsx';
import { ReadyToStartBlock } from '../(customers)/businessmans/blocks/ready-to-start/block';
import { StatusClient } from './components/status-client/block';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock
                    className={styles.block}
                    showActions={false}
                    showStats={false}
                    title='Статус платформы'
                    description='Каждый день платформа автоматически сканируется на наличие инцидентов и целостность компонентов'
                />
                <StatusClient />
                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
    );
}