import styles from './page.module.scss';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.label}>
                <div className={styles.col}>
                    <div className={styles.count}>
                        <span className={styles.value}>124 540.00</span>
                        <span className={styles.afterword}>принесли продажи за <span className={styles.change}>январь</span></span>
                        <span className={styles.description}>
                            На основании учётных данных периода <span className={styles.contrast}>1 января - 12 января, 2025</span>
                        </span>
                    </div>
                </div>
                <div className={styles.col}>
                    <div className={styles.block}>

                    </div>
                </div>
            </div>
        </div>
    )
}