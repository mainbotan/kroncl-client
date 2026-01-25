import styles from './slide.module.scss';

export  function Singleton2Slide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={styles.title}>Реферальные программы. Для всех</div>
                    <div className={styles.description}>От финансов до склада</div>
                </div>
                <div className={styles.col}>
                    <div className={styles.box}></div>
                    <div className={styles.box}></div>
                </div>
            </div>
        </div>
    )
}