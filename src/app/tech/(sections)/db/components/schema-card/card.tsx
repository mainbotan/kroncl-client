'use client';

import clsx from "clsx";
import styles from './card.module.scss';
import { SchemaListItem } from "@/apps/admin/db/types";
import Link from "next/link";

export interface SchemaCardProps {
    className?: string;
    schema: SchemaListItem;
}

export function SchemaCard({
    className,
    schema
}: SchemaCardProps) {
    return (
        <Link href={`/tech/db/schemas/${schema.schema_name}`} className={clsx(styles.container, className, !schema.is_company && styles.public )}>
            <div className={styles.name}>{schema.schema_name}</div>
            <div className={styles.tags}>
                <span className={styles.tag}>{schema.schema_size_mb} МБ</span>
                <span className={styles.tag}>{schema.indexes_count} индексов</span>
                <span className={clsx(styles.tag, styles.accent)}>{schema.tables_count} таблиц</span>
                {schema.migration_dirty ? (<span className={clsx(styles.tag, styles.red)}>dirty</span>) : <span className={clsx(styles.tag, styles.accent)}>not dirty</span>}
                <span className={clsx(styles.tag, schema.migration_dirty ? styles.red : styles.accent)}>{schema.migration_version}</span>
            </div>
        </Link>
    )
}