// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('tech');
import styles from './layout.module.scss';
import { TechPanel } from './components/panel/panel';
import { AdminGuard } from '@/apps/admin/auth/guard/AdminGuard';
import { AdminProvider } from '@/apps/admin/auth/context/AdminContext';
import { AuthProvider } from '@/apps/account/auth/context/AuthContext';
import { ADMIN_MAX_LEVEL, ADMIN_MIN_LEVEL } from '@/apps/admin/auth/types';
import { ScreenProvider } from '../platform/components/screen-control/provider/provider';
import { ScreenControlWarning } from '../platform/components/screen-control/warning';

export default function TechLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <AdminProvider>
                <AdminGuard requiredLevel={ADMIN_MIN_LEVEL} redirectTo="/sso/sign_in">
                    <ScreenProvider>
                        <ScreenControlWarning />
                        <div className={styles.container}>
                            <TechPanel className={styles.panel} />
                            <div className={styles.content}>
                                {children}
                            </div>
                        </div>
                    </ScreenProvider>
                </AdminGuard>
            </AdminProvider>
        </AuthProvider>
    );
}