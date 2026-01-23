import clsx from 'clsx';
import styles from './ico.module.scss';

export function LogoIco({ animate = false, className=""}) {
    return (
        <span className={clsx(styles.area, className)} data-animate={animate}>
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petal} />
        </span>
    )
}