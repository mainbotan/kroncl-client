// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('activity')

import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './../page.module.scss';
import { linksList } from './_links';
import { Pin } from '../../../(about)/pins/2026/pin';
import { ReadyToStartBlock } from '../../businessmans/blocks/ready-to-start/block';
import { DemoBlock } from '../components/demo/block';
import Code from '@/assets/ui-kit/icons/code';
import { StartBlock } from '../components/start/block';
import History from '@/assets/ui-kit/icons/history';

export default function Page() {
    return (
        <>
        <Pin />
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock
                    className={styles.block}
                    title='Мониторинг активности'
                    description='Отслеживайте действия в пространстве организации'
                />

                <DemoBlock
                    className={styles.block}
                    icon={<History />}
                    title='История действий'
                    description='Граф активности в организации подскажет вам кто и какие действия совершал за прошедший год. Критичность и дата действий, UserAgent инициатора и другая информация в подробных логах.'
                    img='/images/mock-ups/company-activity-cut.png'
                />
                
                <QuickLinksBlock
                    links={linksList}
                    className={styles.block} />

                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
        </>
    )
}