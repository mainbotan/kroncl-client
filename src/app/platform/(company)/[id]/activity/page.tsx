import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { LogCard } from './components/log-card/log';
import Copy from '@/assets/ui-kit/icons/copy';

export default function Page() {
    return (
        <>
        <PlatformHead 
            title='История действий'
            description='Активность сотрудников в системе.'
            actions={[
                {
                    variant: 'accent',
                    children: 'Скопировать лог',
                    icon: <Copy />
                }
            ]}
            />
        <div className={styles.grid}>
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
            <LogCard />
        </div>
        </>
    )
}