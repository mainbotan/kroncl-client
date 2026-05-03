import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { DbHistoryChart } from './components/history-chart/chart';
import { SummaryStatsBlock } from './components/summary-stats/block';

export default function Page() {
    return (
        <>
        <PlatformHead 
            title='База данных'
            description='Состояние инстанса, мониторинг нагрузки, схемы организаций.'
        />
        <div className={styles.grid}>
            <SummaryStatsBlock className={styles.summaryBlock} />
            <DbHistoryChart className={styles.loadChart} />
        </div>
        </>
    )
}