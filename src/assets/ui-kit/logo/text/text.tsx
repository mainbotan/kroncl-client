import styles from './text.module.scss';

export function LogoText({ animate = false }) {
    return (
        <span className={styles.area} data-animate={animate}>
            Kroncl
        </span>
    )
}