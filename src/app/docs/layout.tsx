import { navigationSections } from "./(v1)/navigation.config";
import { DocsContent } from "./components/content/content";
import { DocsHeader } from "./components/header/header";
import { DocsSidebarProvider } from "./components/panel/context/context";
import { DocsPanel } from "./components/panel/panel";
import styles from './layout.module.scss';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <DocsSidebarProvider>
            <DocsHeader className={styles.header} />
            <div className={styles.area}>
                <DocsPanel navigation={navigationSections} className={styles.panel} />
                <DocsContent navigation={navigationSections} className={styles.content}>
                    {children}
                </DocsContent>
            </div>
        </DocsSidebarProvider>
    );
}