// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('storage')

import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './../page.module.scss';
import { linksList } from './_links';
import { Pin } from '../../../(about)/pins/2026/pin';
import { ReadyToStartBlock } from '../../businessmans/blocks/ready-to-start/block';
import { DemoBlock } from '../components/demo/block';
import Code from '@/assets/ui-kit/icons/code';
import { StartBlock } from '../components/start/block';

export default function Page() {
    return (
        <>
        <Pin />
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock
                    className={styles.block}
                    title='Хранилище организации'
                    description='Прозначный мониторинг реальных затрат хранилища компании'
                />

                <DemoBlock
                    className={styles.block}
                    icon={<Code />}
                    title='Файлы & Данные модулей'
                    description='Контролируйте каждый мегабайт пространства организации,
                    просматривайте распределение по модулям и оптимизируйте занимаемое пространство.'
                    img='/images/mock-ups/company-storage-cut.png'
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