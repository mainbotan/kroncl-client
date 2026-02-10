import styles from './card.module.scss';

export function PositionCard() {
    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <div className={styles.name}>Директор продаж</div>
                <div className={styles.description}>
                    Менеджмент продаж
                </div>
            </div>
            <div className={styles.graph}>
                
            </div>
        </div>
    )
}