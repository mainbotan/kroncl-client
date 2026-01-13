import Wallet from '@/assets/ui-kit/icons/wallet';
import styles from '../../layout.module.scss';
import { CompanySections } from './sections.example';

export default function Panel() {
    return (
        <div className={styles.grid}>
            <div className={styles.label}></div>
            <div className={styles.basics}>
                <span className={styles.name}>Easy Service</span>
                <span className={styles.slogan}>Рабочее пространство</span>
            </div>
            <div className={styles.body}>
                <section className={styles.section}>
                <span className={styles.icon}><Wallet className={styles.svg} /></span>
                <span className={styles.info}>
                    <div className={styles.title}>Финансы</div>
                </span>
                <span className={styles.add}>
                    <span className={styles.item}>2</span>
                    <span className={styles.item}>22</span>
                </span>
                </section>
                <CompanySections />
            </div>
        </div>
    )
}