import type { Metadata, Viewport } from "next";
import '@/assets/styles/main.scss';
import styles from './layout.module.scss';
import Providers from "./providers";
import ScrollToTop from "./ScrollToTop";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import ThemeScript from "@/assets/utils/theme";

export const metadata: Metadata = {
  title: "Kroncl",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#101010',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={styles.layout} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo/base.png" />
        <meta name="theme-color" content="#101010" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-navbutton-color" content="#101010" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={styles.container} suppressHydrationWarning>
        <ThemeScript />
        <Providers>
            <Header />
            <div className={styles.content}>{children}</div>
            {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}