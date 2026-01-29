import styles from './layout.module.scss';
import clsx from "clsx";
import Collection from "@/assets/ui-kit/icons/collection";
import Wallet from "@/assets/ui-kit/icons/wallet";
import { Header } from "./components/header/header";

export default function PlatformLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
      <div className={styles.canvas}>
          <Header />
          <div className={styles.container}>
            {children}
          </div>
      </div>
      </>
    )
}