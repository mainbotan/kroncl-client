import { LogoIco } from '../ico/ico';
import { LogoText } from '../text/text';
import styles from './full.module.scss';

export function LogoFull({ animate = false }) {
    return (
        <span className={styles.area} data-animate={animate}>
            <span className={styles.box}><LogoIco animate={animate} /></span>
            <span className={styles.box}><LogoText animate={animate} /></span>
        </span>
    )
}