import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import styles from './log.module.scss';

export function LogCard() {
    return (
        <div className={styles.log}>
            <span><SuccessStatus /></span>
            <span className={styles.timestamp}>YYYY-MM-DDTHH:MM:SSZ</span>
            <span className={styles.name}>Открытие займа</span>
            <span className={styles.link}>Серафим Недошивин</span>
            <span className={styles.key}>fm.credits.create</span>
        </div>
    )
}