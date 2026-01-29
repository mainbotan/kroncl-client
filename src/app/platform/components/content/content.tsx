import clsx from 'clsx';
import styles from './content.module.scss';
import Link from 'next/link';
import { Breadcrumbs } from './breadcrumbs/component';

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
            <Breadcrumbs />
            <div className={styles.area}>
                {children}
            </div>
        </div>
    )
}