import { Metadata } from 'next';
import Content from './content';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: "Yieldaa! | Автосервис РФ. | Марки, модели, воронка продаж. | Ещё 500+ отраслевых пакетов в каталоге.",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function Page() {
    return (
        <Content />
    )
}