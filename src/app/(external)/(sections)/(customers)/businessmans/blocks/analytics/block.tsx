import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function AnalyticsBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.point}>
                <span className={styles.marker} />
                <span>Финансы & Аналитика</span>
            </div>
            <div className={styles.title}>Аналитика <span className={styles.accent}>расходов</span> предприятия.</div>
            <div className={styles.description}>
                Без налоговой бюрократии. <br /> 
                Без скрытых категорий расходов. <br />
                Полный аудит реальных финансов.
            </div>
        </div>
    )
}