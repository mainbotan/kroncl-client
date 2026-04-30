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
                Структуризуйте ассортимент услуг/товаров вашего предприятия с возможностью регулярной выгрузки с помощью нашего открытого API.
                <br />
                Настраивайте сезонные скидки, акции и рассылки о предложениях.
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