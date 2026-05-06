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
            title='Финансы'
            description={<>
                Вы всегда видите реальное состояние бизнеса: баланс, доходы и расходы, долги. Ошиблись в проводке? Не нужно ничего удалять — достаточно сделать сторно. Вы знаете, кто из сотрудников принёс деньги, а кто создал расход. Аналитика помогает вовремя заметить кассовый разрыв.
            </>}
            img='/images/mock-ups/company-fm-cut.png'
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