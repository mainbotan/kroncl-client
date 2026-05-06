'use client';

import clsx from 'clsx';
import styles from './layout.module.scss';
import { SupportPanel } from './components/panel/panel';


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className={clsx(styles.container)}>
          {children}
        </div>
    )
}