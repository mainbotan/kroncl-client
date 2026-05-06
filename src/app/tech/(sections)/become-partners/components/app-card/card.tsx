'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { SchemaListItem } from "@/apps/admin/db/types";
import Link from "next/link";
import { Account } from "@/apps/account/types";
import { formatDate } from "@/assets/utils/date";

export interface AppCardProps {
    className?: string;
}

export function AppCard({
    className
}: AppCardProps) {
    return (
        <Link href={`/tech/become-partners/0x`} className={clsx(styles.container, className)}>
            <div className={styles.name}> <span className={styles.secondary}></span></div>
            <div className={styles.tags}>
                <span className={clsx(styles.tag)}></span>
            </div>
        </Link>
    )
}