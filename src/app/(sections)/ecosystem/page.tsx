import styles from './page.module.scss';
import section from '@/assets/chunks/section.module.scss';
import { Metadata } from 'next';
import clsx from 'clsx';
import { StartSlide } from './slides/start/slide';
import { HowSlide } from './slides/how/slide';

export const metadata: Metadata = {
  title: "Yieldaa! | Экосистема. | 500+ открытых отраслевых пакетов для вашего бизнеса.",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function Page() {
    return (
        <>
            <StartSlide />
            <HowSlide />
        </>
    )
}