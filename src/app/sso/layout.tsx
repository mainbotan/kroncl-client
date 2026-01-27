import type { Metadata, Viewport } from "next";
import '@/assets/styles/main.scss';
import styles from './layout.module.scss';
import { Header } from "../(external)/components/header/header";
import { SubFooter } from "../(external)/components/sub-footer/sub-footer";
import { GoHomeBar } from "./components/go-home/bar";
import { BottomBar } from "./components/bottom-bar/bottom-bar";

export const metadata: Metadata = {
  title: "Kroncl | Вход в аккаунт.",
  description: ""
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className={styles.container}>
          <GoHomeBar />
            <div className={styles.content}>{children}</div>
          <BottomBar />
        </div>
    </>
  );
}