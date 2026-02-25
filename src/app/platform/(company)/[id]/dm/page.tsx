import PlatformContent from '@/app/platform/components/content/content';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';

export default function Page() {
    return (
        <>
        <PlatformHead
            title='Сделки'
            description='Управление текущими заказами.'
        />
        </>
    )
}