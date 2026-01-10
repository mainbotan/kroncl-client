import styles from './ico.module.scss';

export function LogoIco({ animate = false }) {
    return (
        <span className={styles.area} data-animate={animate}>
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petal} />
            <span className={styles.petal} />
        </span>
    )
}