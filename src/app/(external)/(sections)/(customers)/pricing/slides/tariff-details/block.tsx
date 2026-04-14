'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useEffect, useState } from 'react';
import { permissionsApi } from '@/apps/permissions/api';
import { PermissionDetail } from '@/apps/permissions/types';
import { getPermissionMeta } from '@/apps/permissions/meta.config';
import { PermissionCode } from '@/apps/permissions/codes.config';
import Spinner from '@/assets/ui-kit/spinner/spinner';

const TARIFF_LEVELS = {
    financier: 3,
    titan: 2,
    stoic: 1,
} as const;

export function TariffDetailsBlock({
    className,
}: PageBlockProps) {
    const [permissions, setPermissions] = useState<PermissionDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await permissionsApi.getPlatformPermissions();
                if (response.status && response.data) {
                    const detailed: PermissionDetail[] = response.data.map(p => {
                        const meta = getPermissionMeta(p.code as PermissionCode);
                        return {
                            ...p,
                            meta: meta || {
                                code: p.code as PermissionCode,
                                title: p.code,
                                description: '',
                                module: 'unknown',
                            },
                        };
                    });
                    detailed.sort((a, b) => b.lvl - a.lvl);
                    setPermissions(detailed);
                }
            } catch (error) {
                console.error('Failed to fetch permissions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const hasAccess = (permission: PermissionDetail, level: number): boolean => {
        return permission.lvl >= level;
    };

    if (loading) {
        return (
            <div className={clsx(styles.block, className)}>
                <div className={styles.loading}>
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.block)}>
            <div className={clsx(styles.grid, className)}>
                <div className={styles.head}>
                    <span className={styles.section}>Код</span>
                    <span className={styles.section}>Действие</span>
                    <span className={styles.section}>Финансист</span>
                    <span className={styles.section}>Титан</span>
                    <span className={styles.section}>Стоик</span>
                </div>
                {permissions.map((permission) => (
                    <div key={permission.code} className={styles.row}>
                        <span className={styles.section}>
                            <code className={styles.text}>{permission.code}</code>
                        </span>
                        <span className={styles.section}>
                            <span className={styles.text}>{permission.meta.title}</span>
                        </span>
                        <span className={styles.section}>
                            {hasAccess(permission, TARIFF_LEVELS.financier) && <SuccessStatus />}
                        </span>
                        <span className={styles.section}>
                            {hasAccess(permission, TARIFF_LEVELS.titan) && <SuccessStatus />}
                        </span>
                        <span className={styles.section}>
                            {hasAccess(permission, TARIFF_LEVELS.stoic) && <SuccessStatus />}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}