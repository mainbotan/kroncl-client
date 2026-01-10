import Spinner from '@/assets/ui-kit/spinner/spinner';
import styles from './page.module.scss';
import section from '@/assets/chunks/section.module.scss';
import { StartSlide } from './slides/start/slide';
import { SourcesSlide } from './slides/sources/slide';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Yieldaa! | Предпринимателям. | База знаний, партёрская программа, интеграции.",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function Businessman() {
    return (
        <>
        <div className={section.head}>
            <div className={section.focus}>
                <div className={section.info}>
                    <div className={section.capture}>Предпринимателям</div>
                </div>
            </div>
        </div>
        <div className={styles.content}>
            <StartSlide />
            <SourcesSlide />
        </div>
        </>
    )
}