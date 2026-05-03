'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { SchemaListItem } from "@/apps/admin/db/types";
import Link from "next/link";
import { Account } from "@/apps/account/types";
import { formatDate } from "@/assets/utils/date";

export interface AccountCardProps {
    className?: string;
    account: Account;
}

export function AccountCard({
    className,
    account
}: AccountCardProps) {
    return (
        <Link href={`/tech/accounts/${account.id}`} className={clsx(styles.container, className)}>
            <div className={styles.name}>{account.name} <span className={styles.secondary}>{account.email}</span></div>
            <div className={styles.tags}>
                {account.status === 'confirmed' ? (
                    <span className={clsx(styles.tag, styles.accent)}>Подтверждён</span>
                ) : (
                    <span className={clsx(styles.tag, styles.red)}>{account.status}</span>
                )}
                <span className={clsx(styles.tag)}>{formatDate(account.created_at)}</span>
            </div>
        </Link>
    )
}