import styles from './page.module.scss';
import { DynamicsBlock } from './slides/dynamics/block';
import { PartnersBlock } from './slides/partners/block';
import { StartBlock } from './slides/start/block';
import { ThesisBlock } from './slides/thesis/block';

export default function Page() {
    return (
        <>
        <div className={styles.container}>
            <div className={styles.grid}>
                <StartBlock className={styles.block} />
                <PartnersBlock className={styles.block} />
                
                <div className={styles.theses}>
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                    <ThesisBlock className={styles.block} />
                </div>
                
                <DynamicsBlock className={styles.block} />
            </div>
        </div>
        </>
    )
}