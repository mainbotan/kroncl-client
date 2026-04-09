'use client';

import { BasePermission, Permission } from '@/apps/permissions/types';
import styles from './wizard.module.scss';
import clsx from 'clsx';
import Input from '@/assets/ui-kit/input/input';
import Close from '@/assets/ui-kit/icons/close';
import Plus from '@/assets/ui-kit/icons/plus';
import { useEffect, useState, useMemo, useRef } from 'react';
import { permissionsApi } from '@/apps/permissions/api';
import { useParams } from 'next/navigation';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import Button from '@/assets/ui-kit/button/button';
import { useMessage } from '@/app/platform/components/lib/message/provider';

export interface PermissionsWizardProps {
    className?: string;
    accountId: string;
    onSave?: (increase: string[], reduce: string[]) => Promise<void>;
}

export function PermissionsWizard({
    className,
    accountId,
    onSave
}: PermissionsWizardProps) {
    const params = useParams();
    const companyId = params.id as string;
    const { showMessage } = useMessage();

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Данные с бэка
    const [initialPermissions, setInitialPermissions] = useState<Set<string>>(new Set());
    const [accountPermissions, setAccountPermissions] = useState<Set<string>>(new Set());
    const [companyPermissions, setCompanyPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    // Загружаем разрешения компании и аккаунта
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const [companyPermsRes, accountPermsRes] = await Promise.all([
                    permissionsApi.getCompanyPermissions(companyId),
                    permissionsApi.getAccountPermissions(companyId, accountId)
                ]);

                if (companyPermsRes.status && companyPermsRes.data) {
                    setCompanyPermissions(companyPermsRes.data);
                }

                if (accountPermsRes.status && accountPermsRes.data) {
                    const perms = new Set(accountPermsRes.data.map(p => p.code));
                    setInitialPermissions(new Set(perms));
                    setAccountPermissions(new Set(perms));
                }
            } catch (error) {
                console.error('Failed to fetch permissions:', error);
                showMessage({
                    label: 'Не удалось загрузить разрешения',
                    variant: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, [companyId, accountId]);

    // Фильтруем доступные разрешения (которые есть у компании, но нет у аккаунта)
    const availablePermissions = useMemo(() => {
        return companyPermissions.filter(p => !accountPermissions.has(p.code));
    }, [companyPermissions, accountPermissions]);

    // Фильтруем по поиску
    const filteredPermissions = useMemo(() => {
        if (!search.trim()) return availablePermissions;
        const lowerSearch = search.toLowerCase();
        return availablePermissions.filter(p => 
            p.code.toLowerCase().includes(lowerSearch)
        );
    }, [availablePermissions, search]);

    // Обработчики
    const handleAddPermission = (permission: Permission) => {
        setAccountPermissions(prev => new Set([permission.code, ...prev]));
        setSearch('');
        setIsModalOpen(false);
    };

    const handleRemovePermission = (code: string) => {
        setAccountPermissions(prev => {
            const newSet = new Set(prev);
            newSet.delete(code);
            return newSet;
        });
    };

    // Закрытие модалки по клику вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
                setSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Фокус на инпут при открытии модалки
    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    // Вычисляем изменения
    const getChanges = () => {
        const increase: string[] = [];
        const reduce: string[] = [];

        // Разрешения, которые есть сейчас, но не было изначально -> increase
        for (const perm of accountPermissions) {
            if (!initialPermissions.has(perm)) {
                increase.push(perm);
            }
        }

        // Разрешения, которые были изначально, но сейчас их нет -> reduce
        for (const perm of initialPermissions) {
            if (!accountPermissions.has(perm)) {
                reduce.push(perm);
            }
        }

        return { increase, reduce };
    };

    // Вычисляем финальные списки, а не изменения
    const getFinalPermissions = () => {
        // increase_permissions = все разрешения, которые есть у аккаунта
        const increase = Array.from(accountPermissions);
        
        // reduce_permissions = все разрешения, которые были изначально, но сейчас их нет
        const reduce: string[] = [];
        for (const perm of initialPermissions) {
            if (!accountPermissions.has(perm)) {
                reduce.push(perm);
            }
        }

        return { increase, reduce };
    };

    // Сохранение
    const handleSave = async () => {
        const { increase, reduce } = getFinalPermissions();

        if (increase.length === 0 && reduce.length === 0) {
            showMessage({
                label: 'Нет изменений для сохранения',
                variant: 'warning'
            });
            return;
        }

        setIsSaving(true);
        try {
            // Отправляем финальные списки
            await onSave?.(increase, reduce);
            
            // Обновляем initialPermissions после успешного сохранения
            setInitialPermissions(new Set(accountPermissions));
            
            showMessage({
                label: 'Настройки разрешений сохранены',
                variant: 'success'
            });
        } catch (error) {
            showMessage({
                label: 'Не удалось сохранить настройки',
                variant: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className={clsx(styles.container, className)}><PlatformLoading /></div>;
    }

    const hasChanges = getChanges().increase.length > 0 || getChanges().reduce.length > 0;

    return (
        <div className={clsx(styles.container, className)}>
            <div className={styles.header}>
                <div className={styles.info}>
                    <div className={styles.title}>Настройки разрешений</div>
                </div>
                <div className={styles.actions}>
                    <Button
                        variant="accent"
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        loading={isSaving}
                        className={styles.action}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>

            <div className={styles.search}>
                <Input
                    ref={inputRef}
                    className={styles.input}
                    placeholder='Начните вводить код разрешения'
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsModalOpen(true);
                    }}
                    onFocus={() => setIsModalOpen(true)}
                />

                <div className={clsx(styles.modal, isModalOpen && styles.open)} ref={modalRef}>
                    <div className={styles.result}>
                        {filteredPermissions.length === 0 ? (
                            <div className={styles.empty}>Ничего не найдено</div>
                        ) : (
                            filteredPermissions.map((perm) => (
                                <div 
                                    key={perm.code} 
                                    className={styles.item}
                                    onClick={() => handleAddPermission(perm)}
                                >
                                    <span className={styles.code}>{perm.code}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.result}>
                {Array.from(accountPermissions).map((code) => (
                    <div key={code} className={styles.item}>
                        <span className={styles.code}>{code}</span>
                        <span 
                            className={styles.icon} 
                            onClick={() => handleRemovePermission(code)}
                        >
                            <Close className={styles.svg} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}