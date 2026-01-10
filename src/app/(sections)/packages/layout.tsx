import { Metadata } from 'next';
import styles from './layout.module.scss';
import Input from '@/assets/ui-kit/input/input';
import clsx from 'clsx';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PackagePreview } from './components/package-preview/package';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import Package from '@/assets/ui-kit/icons/package';
import Button from '@/assets/ui-kit/button/button';


export const metadata: Metadata = {
  title: "Yieldaa! | Отраслевые решения. | Пакетный менеджер.",
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
            <div className={styles.focus}>
                <div className={styles.panel}>
                    <div className={styles.area}>
                        <div className={styles.grid}>
                            <div className={styles.label}>
                                <span className={styles.icon}><Package className={styles.svg} /></span>
                                <span className={styles.info}>
                                    <div className={styles.name}>Packages</div>
                                    <div className={styles.description}>Пакетный менеджер</div>
                                </span>
                            </div>
                            <div className={styles.search}>
                                <Input className={styles.input} placeholder='Название/категория/хэш...' fullWidth/>
                                <div className={clsx(styles.result)}>
                                    <PackagePreview variant='compact' />
                                    <PackagePreview variant='compact' />
                                </div>
                                <div className={clsx(styles.result, styles.plug)}>
                                    <Spinner variant='accent' size='lg' />
                                </div>
                            </div>
                            <Button className={styles.action} variant='accent'>Создать пресет</Button>
                            <div className={styles.add}>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    )
}