import styles from './layout.module.scss';
import clsx from "clsx";
import Collection from "@/assets/ui-kit/icons/collection";
import Wallet from "@/assets/ui-kit/icons/wallet";
import { Header } from "./components/header/header";
import AuthGuard from '@/apps/account/auth/components/AuthGuard';

export default function PlatformLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
      <AuthGuard>
      <div className={styles.canvas}>
          <Header />
          <div className={styles.container}>
            {children}
          </div>
      </div>
      </AuthGuard>
      </>
    )
}