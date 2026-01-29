import clsx from 'clsx';
import styles from './content.module.scss';
import Link from 'next/link';

interface PlatformContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function PlatformContent({
  children,
  className
}: Readonly<PlatformContentProps>) {
    return (
        <div className={clsx(styles.content, className)}>
            <div className={styles.breadcrumbs}>
                <div className={styles.grid}>
                    <Link href='/platform' className={styles.point}>Платформа</Link>
                    <span className={styles.inter}>/</span>
                </div>
            </div>
            <div className={styles.area}>
                {children}
            </div>
        </div>
    )
}