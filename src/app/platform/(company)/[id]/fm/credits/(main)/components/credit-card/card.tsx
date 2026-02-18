'use client';

import clsx from 'clsx';
import styles from './card.module.scss';
import { IndicatorWidget } from '../../../../(main)/components/indicator-widget/widget';
import Button from '@/assets/ui-kit/button/button';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CreditDetail } from '@/apps/company/modules/fm/types';
import { formatDate } from '@/assets/utils/date';

export interface CreditCardProps {
    credit: CreditDetail;
    className?: string;
}

const typeLabels = {
    debt: 'Дебет',
    credit: 'Кредит'
};

const typeTooltips = {
    debt: 'Мы должны',
    credit: 'Нам должны'
};

const statusLabels = {
    active: 'Активен',
    closed: 'Закрыт'
};

const statusTooltips = {
    active: 'Займ не выплачен',
    closed: 'Займ погашен'
};

export function CreditCard({
    credit,
    className
}: CreditCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    // Расчет итоговой суммы с процентами (простые проценты)
    const daysDiff = Math.ceil(
        (new Date(credit.end_date).getTime() - new Date(credit.start_date).getTime()) 
        / (1000 * 60 * 60 * 24)
    );
    const yearlyInterest = credit.total_amount * (credit.interest_rate / 100);
    const totalInterest = (yearlyInterest / 365) * daysDiff;
    const totalAmount = credit.total_amount + totalInterest;

    // Прогресс по дням
    const now = new Date();
    const start = new Date(credit.start_date);
    const end = new Date(credit.end_date);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));

    return (
        <div className={clsx(styles.card, className)}>
            <div className={styles.base}>
                <div className={styles.info}>
                    <div className={styles.name}>{credit.name}</div>
                    {credit.comment && (
                        <div className={styles.description}>{credit.comment}</div>
                    )}
                    <div className={styles.tags}>
                        <ModalTooltip content={typeTooltips[credit.type]}>
                            <span className={clsx(styles.tag, styles.accent)}>
                                {typeLabels[credit.type]}
                            </span>
                        </ModalTooltip>
                        <ModalTooltip content={statusTooltips[credit.status]}>
                            <span className={clsx(styles.tag, styles.accent)}>
                                {statusLabels[credit.status]}
                            </span>
                        </ModalTooltip>
                        <ModalTooltip content='Перейти к контрагенту'>
                            <Link 
                                href={`/platform/${companyId}/fm/credits/counterparties/${credit.counterparty.id}`} 
                                className={clsx(styles.tag, styles.accent)}
                            >
                                {credit.counterparty.name}
                            </Link>
                        </ModalTooltip>
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button 
                        href={`/platform/${companyId}/fm/credits/${credit.id}`}
                        as='link'
                        className={styles.action} 
                        variant='accent'
                    >
                        Открыть
                    </Button>
                </div>
            </div>
            <div className={styles.counters}>
                <IndicatorWidget
                    className={styles.counter}
                    value={{
                        amount: credit.total_amount,
                        unit: '₽'
                    }}
                    legend='Тело займа'
                />
                <IndicatorWidget
                    className={styles.counter}
                    value={{
                        amount: credit.interest_rate,
                        unit: '%'
                    }}
                    legend='Годовая ставка'
                />
                <IndicatorWidget
                    className={styles.counter}
                    value={{
                        amount: Math.round(totalAmount),
                        unit: '₽'
                    }}
                    variant='accent'
                    legend={`Итог на ${formatDate(credit.end_date)}`}
                />
            </div>
            <div className={styles.graph}>
                <span className={styles.start}>{formatDate(credit.start_date)}</span>
                <span className={styles.indicators}>
                    {Array.from({ length: 24 }).map((_, i) => {
                        const sectorProgress = (i + 1) * (100 / 24);
                        return (
                            <span 
                                key={i}
                                className={clsx(
                                    styles.sector, 
                                    sectorProgress <= progress && styles.accent
                                )}
                            />
                        );
                    })}
                </span>
                <span className={styles.end}>{formatDate(credit.end_date)}</span>
            </div>
        </div>
    );
}