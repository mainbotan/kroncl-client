import styles from './wrapper.module.scss';

export function PlatformContentWrapper({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    )
}