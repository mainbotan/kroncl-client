// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('dev')

import styles from './layout.module.scss';
import { DevPanel } from '../components/panel/panel';
import { CommunityHeader } from '../components/header/header';
import { DevSidebarProvider } from '../components/panel/context/context';

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DevSidebarProvider>
        <div className={styles.container}>
          <CommunityHeader className={styles.header} />
          <div className={styles.focus}>
            <DevPanel className={styles.panel} />
            <div className={styles.content}></div>
          </div>
        </div>
      </DevSidebarProvider>
    </>
  );
}