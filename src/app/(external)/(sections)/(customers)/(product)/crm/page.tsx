// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('crm')

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
            title='CRM'
            description={<>
                Вся база клиентов с историей и статусами в одном месте. Знаете, откуда пришёл каждый клиент — оцениваете эффективность каналов привлечения. Отслеживаете динамику: новые, активные, ушедшие. Планируете продажи на реальных данных.
            </>}
            img='/images/mock-ups/company-crm-analysis-cut.png'
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