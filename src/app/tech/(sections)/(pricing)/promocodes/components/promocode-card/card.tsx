'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { SchemaListItem } from "@/apps/admin/db/types";
import Link from "next/link";
import { Account } from "@/apps/account/types";
import { formatDate } from "@/assets/utils/date";
import { IncomingPartner } from "@/apps/admin/partners/types";
import { Promocode } from "@/apps/admin/pricing/promocodes/types";

export interface PromocodeCardProps {
    className?: string;
    promocode: Promocode;
}

export function PromocodeCard({
    className,
    promocode
}: PromocodeCardProps) {
    return (
        <Link href={`/tech/promocodes/${promocode.id}`} className={clsx(styles.container, className)}>
            <div className={styles.name}>{promocode.code}</div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag)}>{formatDate(promocode.created_at)}</span>
                <span className={clsx(styles.tag, styles.accent)}>{promocode.plan_name}</span>
                <span className={clsx(styles.tag, styles.accent)}>{promocode.trial_period_days} дней бесплатно</span>
            </div>
        </Link>
    )
}