// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('dm')

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
            title='Управление сделками'
            description={<>
                Ведите заказы в канбане от первого обращения до закрытия. В карточке всё вместе: клиент, состав, ответственные, финансы. Меняете состав заказа за пару кликов. Каждая сделка автоматически влияет на финансовую отчётность — без двойного ввода.
            </>}
            img='/images/mock-ups/company-dm-cut.png'
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