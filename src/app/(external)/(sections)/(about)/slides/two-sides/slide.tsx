import styles from './slide.module.scss';

export function TwoSidesSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.row}>
                    <div className={styles.col}></div>
                    <div className={styles.col}></div>
                </div>
            </div>
        </div>
    )
}