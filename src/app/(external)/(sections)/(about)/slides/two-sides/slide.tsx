import { LeftBlock } from './left/block';
import { RightBlock } from './right/block';
import styles from './slide.module.scss';

export function TwoSidesSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.row}>
                    <LeftBlock className={styles.col} />
                    <RightBlock className={styles.col}/>
                </div>
            </div>
        </div>
    )
} 