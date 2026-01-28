'use client';

import { useAuth } from "@/apps/account/auth/context/AuthContext";
import PlatformContent from "../components/content/content";
import PlatformPanel from "../components/panel/panel";
import styles from './layout.module.scss';
import Account from "@/assets/ui-kit/icons/account";
import Keyhole from "@/assets/ui-kit/icons/keyhole";
import History from "@/assets/ui-kit/icons/history";
import Bell from "@/assets/ui-kit/icons/bell";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <PlatformPanel className={styles.panel}>
            <div className={styles.head}></div>
            <div className={styles.scroll}>
                <div className={styles.sections}>
                {/* <section className={styles.capture}>Вы</section> */}
                <section className={styles.section}>
                    <span className={styles.icon}><Account className={styles.svg} /></span>
                    <span className={styles.name}>Профиль</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Keyhole className={styles.svg} /></span>
                    <span className={styles.name}>Доступ</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><History className={styles.svg} /></span>
                    <span className={styles.name}>История</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Bell className={styles.svg} /></span>
                    <span className={styles.name}>Приглашения</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Account className={styles.svg} /></span>
                    <span className={styles.name}>Профиль</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Keyhole className={styles.svg} /></span>
                    <span className={styles.name}>Доступ</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><History className={styles.svg} /></span>
                    <span className={styles.name}>История</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Bell className={styles.svg} /></span>
                    <span className={styles.name}>Приглашения</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Account className={styles.svg} /></span>
                    <span className={styles.name}>Профиль</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Keyhole className={styles.svg} /></span>
                    <span className={styles.name}>Доступ</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><History className={styles.svg} /></span>
                    <span className={styles.name}>История</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Bell className={styles.svg} /></span>
                    <span className={styles.name}>Приглашения</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Account className={styles.svg} /></span>
                    <span className={styles.name}>Профиль</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Keyhole className={styles.svg} /></span>
                    <span className={styles.name}>Доступ</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><History className={styles.svg} /></span>
                    <span className={styles.name}>История</span>
                </section>
                <section className={styles.section}>
                    <span className={styles.icon}><Bell className={styles.svg} /></span>
                    <span className={styles.name}>Приглашения</span>
                </section>
            </div>
            <div className={styles.companies}>
                <section className={styles.company}>
                    <span className={styles.icon}>
                        <span className={styles.avatar} />
                    </span>
                    <span className={styles.name}>Easy Service</span>
                </section>
            </div>
            </div>
            <div className={styles.foot}>
                
            </div>
            {/* Организации */}
        </PlatformPanel>
        <PlatformContent>
            {children}
        </PlatformContent>
      </>
    )
}