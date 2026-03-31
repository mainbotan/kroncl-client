'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import type { PricingPlan } from '@/apps/pricing/types';
import { pricingPlansStructures } from './plans.config';
import Link from 'next/link';

export interface PricingPlanProps {
    className?: string;
    plan: PricingPlan;
    onClick: () => void;
}

export function PricingPlan({
    className,
    plan,
    onClick
}: PricingPlanProps) {
    // Находим структуру модулей по lvl плана
    const structure = pricingPlansStructures.find(s => s.lvl === plan.lvl);
    const modules = structure?.modules || [];

    return (
        <div className={clsx(styles.card, className)} onClick={onClick}>
            <div className={styles.title}>{plan.name}</div>
            <div className={styles.description}>{plan.description}</div>
            <div className={styles.content}>
                <div className={styles.capture}>В составе</div>
                <div className={styles.modules}>
                    {modules.map((module, index) => (
                        <div key={index} className={styles.module}>
                            <span className={styles.name}>{module.name}</span>
                            {module.docsLink && (<Link href={module.docsLink} target="_blank" className={styles.value}>О модуле</Link>)}
                        </div>
                    ))}
                </div>
                <div className={styles.features}>
                    <div className={styles.item}>
                        <span className={styles.name}>Хранилище данных</span>
                        <span className={styles.value}>{plan.limit_db_mb / 1024} ГБ</span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.name}>Хранилище файлов/медиа</span>
                        <span className={styles.value}>{plan.limit_objects_mb / 1024} ГБ</span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.name}>Макс. файлов</span>
                        <span className={styles.value}>{plan.limit_objects_count.toLocaleString('ru-RU')}</span>
                    </div>
                </div>
            </div>
            <div className={styles.price}>
                {plan.price_per_month.toLocaleString('ru-RU')} <span className={styles.currency}>&#8381;</span>
                <span className={styles.period}>/ месяц</span>
            </div>
        </div>
    );
}