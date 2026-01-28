import clsx from 'clsx';
import styles from './content.module.scss';

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
            <div className={styles.area}>
                {children}
            </div>
        </div>
    )
}