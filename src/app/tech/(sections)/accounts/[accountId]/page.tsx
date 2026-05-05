'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import styles from './page.module.scss';
import { FieldsBlock } from "@/app/tech/components/fields-block/block";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { adminAccountsApi } from "@/apps/admin/accounts/api";
import { Account } from "@/apps/account/types";
import { useAdminLevel } from "@/apps/admin/auth/hook";
import { ADMIN_LEVEL_2, ADMIN_MAX_LEVEL, ADMIN_MIN_LEVEL } from "@/apps/admin/auth/types";
import clsx from "clsx";
import Button from "@/assets/ui-kit/button/button";
import { AdminKeywordModal } from "@/app/tech/components/keyword-modal/modal";
import { useMessage } from "@/app/platform/components/lib/message/provider";

export default function AccountPage() {
    const params = useParams();
    const accountId = params.accountId as string;
    const { showMessage } = useMessage();
    
    const allowPage = useAdminLevel(ADMIN_LEVEL_2);
    const allowActions = useAdminLevel(ADMIN_MAX_LEVEL);
    
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(ADMIN_MIN_LEVEL);
    const [isPromoting, setIsPromoting] = useState(false);
    
    const [isDemoteModalOpen, setIsDemoteModalOpen] = useState(false);
    const [isDemoting, setIsDemoting] = useState(false);
    
    const currentUserLevel = allowActions.level;
    const maxAvailableLevel = currentUserLevel - 1;

    const loadAccount = useCallback(async () => {
        if (!allowPage.allowed) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await adminAccountsApi.getAccountById(accountId);
            if (response.status && response.data) {
                setAccount(response.data);
            } else {
                setError('Не удалось загрузить аккаунт');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading account:', err);
        } finally {
            setLoading(false);
        }
    }, [accountId, allowPage.allowed]);

    useEffect(() => {
        if (allowPage.allowed) {
            loadAccount();
        }
    }, [loadAccount, allowPage.allowed]);

    const handlePromote = async (keyword: string) => {
        setIsPromoting(true);
        try {
            const response = await adminAccountsApi.promoteToAdmin(accountId, keyword, selectedLevel);
            if (response.status) {
                showMessage({ label: 'Аккаунт назначен администратором', variant: 'success' });
                setIsPromoteModalOpen(false);
                await loadAccount();
            } else {
                showMessage({ label: response.message || 'Ошибка при назначении', variant: 'error' });
            }
        } catch (err: any) {
            showMessage({ label: err.message || 'Ошибка при назначении', variant: 'error' });
        } finally {
            setIsPromoting(false);
        }
    };

    const handleDemote = async (keyword: string) => {
        setIsDemoting(true);
        try {
            const response = await adminAccountsApi.demoteFromAdmin(accountId, keyword);
            if (response.status) {
                showMessage({ label: 'Администратор снят', variant: 'success' });
                setIsDemoteModalOpen(false);
                await loadAccount();
            } else {
                showMessage({ label: response.message || 'Ошибка при снятии', variant: 'error' });
            }
        } catch (err: any) {
            showMessage({ label: err.message || 'Ошибка при снятии', variant: 'error' });
        } finally {
            setIsDemoting(false);
        }
    };

    const getAvailableLevels = useCallback(() => {
        const levels = [];
        for (let i = ADMIN_MIN_LEVEL; i <= maxAvailableLevel; i++) {
            levels.push(i);
        }
        return levels;
    }, [maxAvailableLevel]);

    const canPromote = useMemo(() => {
        return allowActions.allowed && !account?.is_admin && currentUserLevel > ADMIN_MIN_LEVEL;
    }, [allowActions.allowed, account?.is_admin, currentUserLevel]);

    const canDemote = useMemo(() => {
        return allowActions.allowed && account?.is_admin && account?.admin_level !== undefined && currentUserLevel > account.admin_level;
    }, [allowActions.allowed, account?.is_admin, account?.admin_level, currentUserLevel]);

    const isLoading = allowPage.isLoading || loading || allowActions.isLoading;

    if (isLoading) return <PlatformLoading />;
    
    if (error) return <PlatformError error={error} />;

    if (!allowPage.allowed) return <PlatformError error="Доступ запрещён" />;

    if (!account) return <PlatformError error="Аккаунт не найден" />;

    const fields = [
        { label: 'ID', value: account.id },
        { label: 'Email', value: account.email },
        { label: 'Имя', value: account.name },
        { label: 'Тип авторизации', value: account.auth_type },
        { label: 'Статус', value: account.status },
        { label: 'Тип аккаунта', value: account.type },
        { label: 'Администратор', value: account.is_admin ? `Да (уровень ${account.admin_level})` : 'Нет' },
        { label: 'Описание', value: account.description || '—' },
        { label: 'Avatar URL', value: account.avatar_url || '—' },
        { label: 'Создан', value: new Date(account.created_at).toLocaleString() },
        { label: 'Обновлён', value: new Date(account.updated_at).toLocaleString() },
    ];

    return (
        <>
            <PlatformHead
                title={account.name}
                description={account.email}
            />
            <div className={styles.container}>
                {canPromote && (
                    <div className={styles.remoteAdmin}>
                        <div className={styles.info}>
                            <div className={styles.title}>Дать админа?</div>
                            <div className={styles.description}>
                                Выберите уровень администратора для аккаунта {account.email}. Ваш уровень: {currentUserLevel}
                            </div>
                        </div>
                        <div className={styles.chooseLevel}>
                            {getAvailableLevels().map((level) => (
                                <span 
                                    key={level}
                                    className={clsx(styles.col, {
                                        [styles.active]: selectedLevel === level,
                                    })}
                                    onClick={() => setSelectedLevel(level)}
                                >
                                    {level}
                                </span>
                            ))}
                        </div>
                        <Button
                            variant="accent"
                            onClick={() => setIsPromoteModalOpen(true)}
                        >
                            Назначить администратором
                        </Button>
                    </div>
                )}
                
                {canDemote && (
                    <div className={styles.remoteAdmin}>
                        <div className={styles.info}>
                            <div className={styles.title}>Снять с должности администратора</div>
                            <div className={styles.description}>
                                Аккаунт {account.email} потеряет все права администратора платформы.
                            </div>
                        </div>
                        <Button
                            variant="red"
                            onClick={() => setIsDemoteModalOpen(true)}
                        >
                            Снять администратора
                        </Button>
                    </div>
                )}
                
                <FieldsBlock
                    className={styles.fields}
                    fields={fields}
                />
            </div>

            <AdminKeywordModal
                isOpen={isPromoteModalOpen}
                onClose={() => setIsPromoteModalOpen(false)}
                onConfirm={handlePromote}
                title="Назначение администратора"
                description={`Вы собираетесь назначить аккаунт ${account.email} администратором с уровнем ${selectedLevel}. Это действие требует подтверждения ключевым словом.`}
                actionName="Назначить"
                isLoading={isPromoting}
            />

            <AdminKeywordModal
                isOpen={isDemoteModalOpen}
                onClose={() => setIsDemoteModalOpen(false)}
                onConfirm={handleDemote}
                title="Снятие администратора"
                description={`Вы собираетесь снять статус администратора с аккаунта ${account.email}. Это действие требует подтверждения ключевым словом.`}
                actionName="Снять"
                isLoading={isDemoting}
            />
        </>
    );
}