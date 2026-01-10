import styles from './page.module.scss';
import section from '@/assets/chunks/section.module.scss';
import { StartSlide } from './slides/start/slide';
import { Metadata } from 'next';
import clsx from 'clsx';
import { TariffsSlide } from './slides/tariffs/slide';

export const metadata: Metadata = {
  title: "Yieldaa! | Тарифы и ценообразование. | Подъёмные цены, гибкая тарификация.",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function Page() {
    return (
        <>
            <div className={section.head}>
                <div className={section.focus}>
                    <div className={section.info}>
                        <div className={section.capture}>Тарифы и ценообразование</div>
                    </div>
                </div>
            </div>
            <StartSlide />
            <TariffsSlide />
        </>
    )
}