import { AnalyticsBlock } from './blocks/analytics/block';
import { GradientBlock } from './blocks/gradient/block';
import { ReadyToStartBlock } from './blocks/ready-to-start/block';
import { ReportsBlock } from './blocks/reports/block';
import { StartBlock } from './blocks/start/block';
import styles from './page.module.scss';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />

                <GradientBlock />
                <div className={styles.benefitsGrid}>
                    <AnalyticsBlock className={styles.block} />
                    <ReportsBlock className={styles.block} />
                </div>

                <div className={styles.interval} />
                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
    )
}