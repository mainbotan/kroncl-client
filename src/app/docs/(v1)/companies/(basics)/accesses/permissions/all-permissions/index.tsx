'use client';

import clsx from "clsx";
import styles from './block.module.scss';
import { PermissionDetail } from "@/apps/permissions/types";
import { useEffect, useState, useMemo } from "react";
import { permissionsApi } from "@/apps/permissions/api";
import { getPermissionMeta } from "@/apps/permissions/meta.config";
import { PermissionCode } from "@/apps/permissions/codes.config";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import Input from "@/assets/ui-kit/input/input";
import { useMessage } from "@/app/platform/components/lib/message/provider";

export interface AllPermissionsBlockProps {
    className?: string;
}

export function PermissionItem({
    lvl,
    criticality,
    allow_expired,
    available,
    meta
}: PermissionDetail) {
    const { showMessage } = useMessage();

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(meta.code);
            
            showMessage({
                variant: 'success',
                label: 'Код скопирован',
            });
        } catch (error) {
            console.error('Failed to copy:', error);
            
            showMessage({
                variant: 'error',
                label: 'Ошибка копирования',
            });
        }
    };

    return (
        <div 
            className={styles.permission} 
            onClick={handleCopyCode}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCopyCode();
                }
            }}
        >
            <div className={styles.tags}>
                <span className={styles.tag}>{meta.code}</span>
                <span className={styles.tag}>{meta.category || 'Без категории'}</span>
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{meta.title}</div>
                <div className={styles.description}>{meta.description}</div>
            </div>
        </div>
    )
}

export function AllPermissionsBlock({
    className
}: AllPermissionsBlockProps) {
    useMessage
    const [permissions, setPermissions] = useState<PermissionDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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

    // Фильтрация разрешений по поисковому запросу
    const filteredPermissions = useMemo(() => {
        if (!searchQuery.trim()) {
            return permissions;
        }
        
        const query = searchQuery.toLowerCase().trim();
        return permissions.filter(permission => {
            return (
                permission.meta.code.toLowerCase().includes(query) ||
                permission.meta.title.toLowerCase().includes(query) ||
                permission.meta.description.toLowerCase().includes(query) ||
                (permission.meta.category && permission.meta.category.toLowerCase().includes(query))
            );
        });
    }, [permissions, searchQuery]);

    // Группировка разрешений по категориям
    const groupedPermissions = useMemo(() => {
        const groups: { [category: string]: PermissionDetail[] } = {};
        
        filteredPermissions.forEach(permission => {
            const category = permission.meta.category || 'Без категории';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(permission);
        });
        
        // Сортируем категории
        const sortedGroups: { [category: string]: PermissionDetail[] } = {};
        Object.keys(groups)
            .sort((a, b) => {
                if (a === 'Без категории') return 1;
                if (b === 'Без категории') return -1;
                return a.localeCompare(b);
            })
            .forEach(key => {
                sortedGroups[key] = groups[key];
            });
        
        return sortedGroups;
    }, [filteredPermissions]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    if (loading) {
        return (
            <div className={clsx(styles.container, className)}>
                <div className={styles.loading}>
                    <Spinner variant="accent" size='lg' />
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.container, className)}>
            <Input 
                fullWidth 
                className={styles.search} 
                placeholder="Найти разрешение по коду, названию или описанию"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            
            {searchQuery && filteredPermissions.length === 0 ? (
                <div className={styles.empty}>
                    Ничего не найдено по запросу "{searchQuery}"
                </div>
            ) : (
                Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                    <div key={category} className={styles.categoryGroup}>
                        {/* <div className={styles.categoryTitle}>
                            {category}
                            <span className={styles.categoryCount}>
                                ({categoryPermissions.length})
                            </span>
                        </div> */}
                        <div className={styles.permissionsList}>
                            {categoryPermissions.map((permission) => (
                                <PermissionItem {...permission} key={permission.code} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}