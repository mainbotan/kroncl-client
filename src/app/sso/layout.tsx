// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('sso')

import styles from './layout.module.scss';
import { Header } from "../(external)/components/header/header";
import { SubFooter } from "../(external)/components/sub-footer/sub-footer";
import { GoHomeBar } from "./components/go-home/bar";
import { BottomBar } from "./components/bottom-bar/bottom-bar";
import { Background } from './components/background/background';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Background className={styles.background} />
        <div className={styles.container}>
          <GoHomeBar />
            <div className={styles.content}>{children}</div>
          <BottomBar />
        </div>
    </>
  );
}