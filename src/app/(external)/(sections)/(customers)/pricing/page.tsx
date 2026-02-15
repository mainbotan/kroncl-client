import styles from './page.module.scss';
import { TariffsBlock } from './slides/tariffs/block';

export default function Page() {
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <TariffsBlock className={styles.block} />
            </div>
        </div>
    )
}