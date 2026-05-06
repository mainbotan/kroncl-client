'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { SchemaListItem } from "@/apps/admin/db/types";
import Link from "next/link";
import { Account } from "@/apps/account/types";
import { formatDate } from "@/assets/utils/date";
import { CompanyAccount } from "@/apps/admin/companies/types";

export interface CompanyMemberCardProps {
    className?: string;
    account: CompanyAccount;
}

export function CompanyMemberCard({
    className,
    account
}: CompanyMemberCardProps) {
    return (
        <Link href={`/tech/accounts/${account.account_id}`} className={clsx(styles.container, className)}>
            <div className={styles.name}>{account.name} <span className={styles.secondary}>{account.email}</span></div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag, styles.accent)}>{account.role_code}</span>
                {account.status === 'confirmed' ? (
                    <span className={clsx(styles.tag, styles.accent)}>Подтверждён</span>
                ) : (
                    <span className={clsx(styles.tag, styles.red)}>{account.status}</span>
                )}
                <span className={clsx(styles.tag)}>Присоединился {formatDate(account.joined_at)}</span>
            </div>
        </Link>
    )
}