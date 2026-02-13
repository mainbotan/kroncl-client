import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';

export function ReportsBlock({
    className
}: PageBlockProps) {
    return (
        <div className={clsx(styles.block, className)}>
            <div className={styles.point}>
                <span className={styles.marker} />
                <span>Финансы & Отчётность</span>
            </div>
            <div className={styles.title}>Отчёты - <span className={styles.accent}>когда и сколько</span> захотите.</div>
            <div className={styles.description}>
                Выгрузка истории операций за целевой промежуток времени. 
                Настраивайте формат данных - от привязки к сотрудникам до даты проведения операции.
            </div>
        </div>
    )
}