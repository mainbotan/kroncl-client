// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('security')

import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './../page.module.scss';
import { linksList } from './_links';
import { Pin } from '../../../(about)/pins/2026/pin';
import { ReadyToStartBlock } from '../../businessmans/blocks/ready-to-start/block';
import { DemoBlock } from '../components/demo/block';
import Code from '@/assets/ui-kit/icons/code';
import { StartBlock } from '../components/start/block';
import Keyhole from '@/assets/ui-kit/icons/keyhole';

export default function Page() {
    return (
        <>
        <Pin />
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock
                    className={styles.block}
                    title='Безопасность организации'
                    description='Enterprise безопасность для малого бизнеса'
                />

                <DemoBlock
                    className={styles.block}
                    icon={<Keyhole />}
                    title='Изоляция & Анонимность'
                    description='Данные организаций изолированы, мы не требуем юридических данных для инициализации пространства и даём возможность безвозвратного 
                    удаления всех данных компании, включая логи действий.'
                    img='/images/mock-ups/create-company-cut.png'
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