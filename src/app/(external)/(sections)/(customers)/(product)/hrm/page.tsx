// meta
import { Metadata } from 'next';
import { getMetaConfig } from '@/config/meta.config';
export const metadata: Metadata = getMetaConfig('hrm')

import { QuickLinksBlock } from '@/app/(external)/components/quick-links/quick-links';
import styles from './../page.module.scss';
import { linksList } from './_links';
import { OverviewBlock } from '../components/overview/block';
import { Pin } from '../../../(about)/pins/2026/pin';

export default function Page() {
    return (
        <>
        <Pin />
        <OverviewBlock 
            title='Сотрудники'
            description={<>
                Сотрудник появляется в отчётности сразу — не нужно ждать регистрации в системе. Назначили должность — права доступа подтянулись автоматически. Уволился? Деактивируйте карточку, данные не теряются. Привязали аккаунт — сотрудник работает сам. Не привязали — вы ведёте учёт за него. Полный контроль даже без компьютеров у сотрудников.
            </>}
            img='/images/mock-ups/company-account-cut.png'
            className={styles.overview} />
        <div className={styles.container}>
            <div className={styles.grid}>
                <QuickLinksBlock
                    links={linksList}
                    className={styles.block} />
            </div>
        </div>
        </>
    )
}