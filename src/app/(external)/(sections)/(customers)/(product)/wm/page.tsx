// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('wm')

import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './../page.module.scss';
import { linksList } from './_links';
import { OverviewBlock } from '../components/overview/block';
import { Pin } from '../../../(about)/pins/2026/pin';

export default function Page() {
    return (
        <>
        <Pin />
        <OverviewBlock 
            title='Каталог & Склад'
            description={<>
                Стройте ассортимент удобно: категории, единицы измерения, цены. Учитывайте товары поштучно или партиями (FIFO/LIFO). История поставок и отгрузок даёт точный остаток в реальном времени. Видите, что залёживается, а что уходит — вовремя корректируете закупки.
            </>}
            img='/images/mock-ups/company-wm-cut.png'
            className={styles.overview} />
        <div className={styles.container}>
            <div className={styles.grid}>
                <QuickLinksBlock
                    links={linksList}
                    className={styles.block} />
            </div>
        </div>
        </>
    )
}