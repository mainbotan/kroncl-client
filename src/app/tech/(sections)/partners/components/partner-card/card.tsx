'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { SchemaListItem } from "@/apps/admin/db/types";
import Link from "next/link";
import { Account } from "@/apps/account/types";
import { formatDate } from "@/assets/utils/date";
import { IncomingPartner } from "@/apps/admin/partners/types";

export interface PartnerCardProps {
    className?: string;
    partner: IncomingPartner;
}

export function PartnerCard({
    className,
    partner
}: PartnerCardProps) {
    return (
        <Link href={`/tech/partners/${partner.id}`} className={clsx(styles.container, className)}>
            <div className={styles.name}>{partner.name} <span className={styles.secondary}>{partner.email}</span></div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag)}>{formatDate(partner.created_at)}</span>
                <span className={clsx(styles.tag, partner.status === 'success' && styles.accent)}>{partner.status}</span>
            </div>
        </Link>
    )
}