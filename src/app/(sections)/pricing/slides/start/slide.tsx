import styles from './slide.module.scss';

export function StartSlide() {
    return (
        <div className={styles.slide}>
            <div className={styles.focus}>
                <div className={styles.col}>
                    <div className={styles.capture}>
                        <span className={styles.brand}>Подъёмные</span> цены.<br />
                        Гибкая тарификация.
                    </div>
                    <div className={styles.description}>Для предприятий любого масштаба.</div>
                </div>
            </div>
        </div>
    )
}