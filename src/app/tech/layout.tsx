// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('tech')
import styles from './layout.module.scss';
import { TechPanel } from './components/panel/panel';

export default function TechLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className={styles.container}>
            <TechPanel 
              className={styles.panel} />
            
            <div className={styles.content}>
              {children}
            </div>
        </div>
    )
}