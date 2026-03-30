import clsx from 'clsx';
import styles from './card.module.scss';

export interface PricingPlanProps {
    className?: string;
}

export function PricingPlan({
    className
}: PricingPlanProps) {
    return (
        <div className={clsx(styles.card, className)}>
            <div className={styles.title}>Финансист</div>
            <div className={styles.description}>Приводим финансовую отчётность в порядок.</div>
            <div className={styles.content}>
                <div className={styles.capture}>В составе</div>
                <div className={styles.modules}>
                    <div className={styles.module}>
                        <span className={styles.name}>Финансы организации</span>
                        <span className={styles.value}>Читать</span>
                    </div>
                    <div className={styles.module}>
                        <span className={styles.name}>Управление сотрудниками</span>
                        <span className={styles.value}>Читать</span>
                    </div>
                    <div className={styles.module}>
                        <span className={styles.name}>Каталог & Склад</span>
                        <span className={styles.value}>Читать</span>
                    </div>
                    <div className={styles.module}>
                        <span className={styles.name}>Клиентская база</span>
                        <span className={styles.value}>Читать</span>
                    </div>
                    <div className={styles.module}>
                        <span className={styles.name}>Сделки</span>
                        <span className={styles.value}>Читать</span>
                    </div>
                </div>
                <div className={styles.features}>
                    <div className={styles.item}>
                        <span className={styles.name}>Хранилище данных</span>
                        <span className={styles.value}>5 ГБ</span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.name}>Хранилище файлов/медиа</span>
                        <span className={styles.value}>50 ГБ</span>
                    </div>
                </div>
            </div>
            <div className={styles.price}>
                565 <span className={styles.currency}>&#8381;</span>
                <span className={styles.period}>/ месяц</span>
            </div>
        </div>
    )
}