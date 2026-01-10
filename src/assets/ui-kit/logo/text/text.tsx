import styles from './text.module.scss';

export function LogoText({ animate = false }) {
    return (
        <span className={styles.area} data-animate={animate}>
            Yiel<span className={styles.brand}>da<span className={styles.rotate}>a</span>!</span>
            <span className={styles.shadow} />
        </span>
    )
}