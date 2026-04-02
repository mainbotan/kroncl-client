'use client';

import clsx from 'clsx';
import styles from './wrapper.module.scss';

export function PlatformContentWrapper({
  children,
  padding = true
}: Readonly<{
  children: React.ReactNode;
  padding?: boolean;
}>) {
    return (
        <div className={clsx(styles.wrapper, padding && styles.padding)}>
            {children}
        </div>
    )
}