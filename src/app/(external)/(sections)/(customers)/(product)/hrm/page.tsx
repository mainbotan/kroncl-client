// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('hrm')

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
            title='Сотрудники'
            description={<>
                Сотрудник не обязан иметь аккаунт, чтобы участвовать в отчетности компании. 
                <br />
                Стройте графики рабочих часов, отслеживайте активность сотрудников, планируйте зарплатные выплаты и поощрения за выполненную работу.
            </>}
            img='/images/mock-ups/company-account-cut.png'
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