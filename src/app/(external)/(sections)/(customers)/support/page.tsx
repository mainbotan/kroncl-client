import { ReadyToStartBlock } from '../businessmans/blocks/ready-to-start/block';
import styles from './page.module.scss';
import { MainBlock } from './slides/main/block';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <MainBlock className={styles.block} />
                <ReadyToStartBlock className={styles.block} />
            </div>
        </div>
    )
}