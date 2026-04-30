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
                Получайте еженедельные отчёты о движении финансов вашего предприятия.
                <br />
                Планируйте выплату кредитных обязательств, сокращайте кассовые разрывы и контролируйте выплаты сотрудникам.
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