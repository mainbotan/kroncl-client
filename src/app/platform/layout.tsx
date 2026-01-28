'use client';

import styles from './layout.module.scss';
import clsx from "clsx";
import Collection from "@/assets/ui-kit/icons/collection";
import Wallet from "@/assets/ui-kit/icons/wallet";
import { Header } from "./components/header/header";
import { useAuth } from "@/apps/account/auth/context/AuthContext";

export default function PlatformLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();

  return (
      <>
        <Header />
        <div className={styles.container}>
          {children}
        </div>
      </>
    )
}