import { Metadata } from "next";
import styles from './layout.module.scss';
import clsx from "clsx";
import CheckMark from "@/assets/ui-kit/icons/check-mark";
import Wallet from "@/assets/ui-kit/icons/wallet";
import { CompanySections } from "./sections.example";
import { CompaniesIcons } from "./companies.example";
import Collection from "@/assets/ui-kit/icons/collection";
import { Header } from "./components/header/header";

export const metadata: Metadata = {
  title: "Kroncl | Платформа.",
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
      <>
        <Header />
        <div className={styles.container}>
          <div className={clsx(styles.panel, styles.quickAccess)}>
              <div className={styles.top}>
                <div className={styles.sections}>
                  <section className={styles.section}>
                    <div className={styles.icon}><Collection className={styles.svg} /></div>
                    <div className={styles.name}><span className={styles.text}>Компании</span></div>
                  </section>
                  <section className={styles.section}>
                    <div className={styles.icon}><Wallet className={styles.svg} /></div>
                    <div className={styles.name}><span className={styles.text}>Кошелёк</span></div>
                  </section>
                </div>
                <div className={styles.inter}><span /></div>
                <div className={styles.companies}>
                    <div className={styles.item}>
                      <span className={styles.new}>32</span>
                    </div>
                    <CompaniesIcons />
                </div>
              </div>
              <div className={styles.bottom}>
                <div className={styles.avatar}><div className={styles.img} /></div>
              </div>
          </div>
          <div className={clsx(styles.panel, styles.company)}>
            <div className={styles.area}>
              <div className={styles.grid}>
                <div className={styles.label}></div>
                <div className={styles.basics}>
                  <span className={styles.name}>Easy Service</span>
                  <span className={styles.slogan}>Рабочее пространство</span>
                </div>
                <div className={styles.body}>
                  <section className={styles.section}>
                    <span className={styles.icon}><Wallet className={styles.svg} /></span>
                    <span className={styles.info}>
                      <div className={styles.title}>Финансы</div>
                    </span>
                    <span className={styles.add}>
                      <span className={styles.item}>2</span>
                      <span className={styles.item}>22</span>
                    </span>
                  </section>
                  <CompanySections />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.area}>
              <div className={styles.breadcrumbs}>
                <span className={styles.point}>Пукпупу</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпупуsdask;dl</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпу22пу</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпупуsdask;dl</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпу22пу</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпупуsdask;dl</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпу22пу</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпупуsdask;dl</span>
                <span className={styles.inter}>/</span>
                <span className={styles.point}>Пукпу22пу</span>
              </div>
              {children}
            </div>
          </div>
        </div>
      </>
    )
}