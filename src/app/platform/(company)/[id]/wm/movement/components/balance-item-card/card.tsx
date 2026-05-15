'use client';

import { StockBalanceItem } from '@/apps/company/modules/wm/types';
import styles from './card.module.scss';
import clsx from 'clsx';
import { shortenId } from '@/assets/utils/ids';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import { getUnitRu } from '../../../(catalog)/units/new/_units';

export interface BalanceItemCardProps {
    className?: string;
    balance: StockBalanceItem;
}

export function BalanceItemCard({
    className,
    balance
}: BalanceItemCardProps) {
    const params = useParams();
    const companyId = params.id as string;

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.base}>
                <ModalTooltip content={balance.available === 0 ? 'Стагнация — товар на складе отсутствует' : (balance.available < 0 ? 'Отрицательная доступность - складской разрыв' : 'Положительная доступность')}>
                    <span className={clsx(styles.indicator, balance.available === 0 ? undefined : (balance.available < 0 ? styles.negative : styles.positive))} />
                </ModalTooltip>
                <div className={styles.info}>
                    <span className={clsx(styles.section, styles.name)}>{balance.unit.name}</span>
                    <span className={clsx(styles.section, styles.secondary)}>доступно {balance.available} {getUnitRu(balance.unit.unit)}</span>
                    <ModalTooltip content='Уникальный идентификатор товарной позиции'>
                        <Link href={`/platform/${companyId}/wm/units/${balance.unit_id}`} className={clsx(styles.section, styles.id)}>{shortenId(balance.unit_id)}</Link>
                    </ModalTooltip>
                </div>
            </div>
        </div>
    )
}