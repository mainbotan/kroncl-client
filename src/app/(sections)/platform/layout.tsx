import { Metadata } from "next";
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: "Kroncl",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className={styles.container}>
            <div className={styles.panel}>

            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}