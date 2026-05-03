'use client';

import clsx from "clsx";
import styles from '../schema-card/card.module.scss';
import Link from "next/link";
import { TableInfo } from "@/apps/admin/db/types";

export interface SchemaCardProps {
    className?: string;
    table: TableInfo;
}

export function TableCard({
    className,
    table
}: SchemaCardProps) {
    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.name}>{table.table_name}</div>
            <div className={styles.tags}>
                <span className={styles.tag}>{table.size_kb} КБ</span>
                <span className={styles.tag}>{table.size_mb} МБ</span>
            </div>
        </div>
    )
}