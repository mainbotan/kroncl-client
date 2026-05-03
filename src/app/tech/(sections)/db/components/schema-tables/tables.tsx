'use client';

import { useEffect, useState } from 'react';
import { TableCard } from '../table-card/card';
import { adminDbApi } from '@/apps/admin/db/api';
import { TableInfo } from '@/apps/admin/db/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import clsx from 'clsx';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformEmptyCanvas } from '@/app/platform/components/lib/empty-canvas/canvas';

export interface SchemaTablesProps {
    className?: string;
    schemaName: string;
}

export function SchemaTables({ className, schemaName }: SchemaTablesProps) {
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await adminDbApi.getSchemaTables(schemaName);
                if (response.status && response.data) {
                    setTables(response.data);
                } else {
                    setError('Не удалось загрузить таблицы');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error('Error loading tables:', err);
            } finally {
                setLoading(false);
            }
        };

        if (schemaName) {
            fetchTables();
        }
    }, [schemaName]);

    if (loading) return (
        <PlatformLoading />
    )

    if (error) return (
        <PlatformError error={error} />
    )

    if (tables.length === 0) return (
        <PlatformEmptyCanvas title='Нет таблиц в этой схеме' />
    )

    return (
        <div className={className}>
            {tables.map((table) => (
                <TableCard key={table.table_name} table={table} />
            ))}
        </div>
    );
}