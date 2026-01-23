import { LogoFull } from '@/assets/ui-kit/logo/full/full';
import styles from './sub-footer.module.scss';
import { LogoIco } from '@/assets/ui-kit/logo/ico/ico';

export function SubFooter() {
    return (
        <div className={styles.container}>
            <span className={styles.logo}><LogoIco className={styles.ico} /></span>
            <span>This is <span className={styles.brand}>Kroncl.</span></span>
        </div>
    )
}