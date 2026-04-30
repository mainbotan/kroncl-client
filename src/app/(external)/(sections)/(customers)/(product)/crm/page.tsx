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
                Перенесите клиентскую базу в защищённое хранилище Kroncl. 
                <br />
                Ведите индивидуальную историю клиентов, используйте инструменты повторого привлечения для повышения показателей удержания клиента.
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