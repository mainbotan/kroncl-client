import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './page.module.scss';
import { ForPartnersBlock } from './slides/for-partners/block';
import { StartBlock } from './slides/start/block';
import { TariffsBlock } from './slides/tariffs/block';
import { linksList } from './_links';
import { TrialPeriodBlock } from './slides/trial/block';
import { ReadyToStartBlock } from '../businessmans/blocks/ready-to-start/block';
import clsx from 'clsx';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />
                
                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>

                <TrialPeriodBlock className={clsx(styles.block, styles.trial)} />
                <TariffsBlock className={styles.block} />
                <ForPartnersBlock className={styles.block} />

                <div className={styles.intervalFlex}>
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <QuickLinksBlock links={linksList} className={styles.block} />
                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
    )
}