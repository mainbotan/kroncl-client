'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Plus from '@/assets/ui-kit/icons/plus';
import { PlatformHead } from '../../components/lib/head/head';
import { TokenCard } from './components/token-card/card';
import styles from './page.module.scss';
import { fingerprintsApi } from '@/apps/account/fingerprints/api';
import { FingerprintsResponse } from '@/apps/account/fingerprints/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';

export default function Page() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { handlePageChange } = usePagination({
        baseUrl: pathname,
        defaultLimit: 20
    });
    const { showMessage } = useMessage();

    const [data, setData] = useState<FingerprintsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Состояние для модалки отзыва
    const [revokeModal, setRevokeModal] = useState<{
        isOpen: boolean;
        fingerprintId: string | null;
    }>({ isOpen: false, fingerprintId: null });
    const [isRevoking, setIsRevoking] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const page = parseInt(searchParams.get('page') || '1');
            const limit = parseInt(searchParams.get('limit') || '20');
            const status = searchParams.get('status') as 'active' | 'inactive' | undefined;
            const search = searchParams.get('search') || undefined;

            const response = await fingerprintsApi.getFingerprints({
                page,
                limit,
                status,
                search
            });
            
            if (response.status) {
                setData(response.data);
            } else {
                setError("Не удалось загрузить ключи");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading fingerprints:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [searchParams]);

    const handleSearch = useCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Сбрасываем на первую страницу при поиске
        router.push(`${pathname}?${params.toString()}`);
    }, [pathname, router, searchParams]);

    const handleRevoke = async () => {
        if (!revokeModal.fingerprintId) return;
        
        setIsRevoking(true);
        try {
            const response = await fingerprintsApi.revokeFingerprint(revokeModal.fingerprintId);
            
            if (response.status) {
                showMessage({
                    label: 'Ключ успешно деактивирован',
                    variant: 'success'
                });
                setRevokeModal({ isOpen: false, fingerprintId: null });
                loadData(); // Обновляем список
            } else {
                throw new Error(response.message || 'Ошибка при деактивации ключа');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось деактивировать ключ',
                variant: 'error',
                about: error.message
            });
            setRevokeModal({ isOpen: false, fingerprintId: null });
        } finally {
            setIsRevoking(false);
        }
    };

    const queryParams: Record<string, string> = {};
    const limitParam = searchParams.get('limit');
    if (limitParam) queryParams.limit = limitParam;
    const statusParam = searchParams.get('status');
    if (statusParam) queryParams.status = statusParam;
    const searchParam = searchParams.get('search');
    if (searchParam) queryParams.search = searchParam;

    const fingerprints = data?.fingerprints || [];
    const pagination = data?.pagination;

    if (loading) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            <Spinner />
        </div>
    );
    
    if (error) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            {error}
        </div>
    );

    return (
        <>
            <PlatformHead
                title='Доступ к аккаунту'
                description='Управление доступом к аккаунту. Выпуск и отзыв отпечатков.'
                actions={[
                    {
                        children: 'Выпустить ключ',
                        icon: <Plus />,
                        variant: 'accent',
                        as: 'link',
                        href: '/platform/security/create-fingerprint'
                    }
                ]}
                showSearch={true}
                searchProps={{
                    placeholder: 'Поиск по ключам...',
                    defaultValue: searchParams.get('search') || '',
                    onSearch: handleSearch,
                    debounceMs: 500
                }}
            />
            
            <div className={styles.grid}>
                {fingerprints.length === 0 ? (
                    <div style={{
                        gridColumn: "1 / -1",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontSize: ".7em", 
                        color: "var(--color-text-description)", 
                        minHeight: "10rem",
                        width: "100%"
                    }}>
                        {searchParams.get('search') 
                            ? 'Ничего не найдено' 
                            : 'Нет ключей доступа'}
                    </div>
                ) : (
                    fingerprints.map((fingerprint) => (
                        <TokenCard 
                            key={fingerprint.id}
                            fingerprint={fingerprint}
                            className={styles.item}
                            onRevoke={(id) => setRevokeModal({ 
                                isOpen: true, 
                                fingerprintId: id 
                            })}
                        />
                    ))
                )}
            </div>

            {pagination && pagination.pages > 1 && (
                <div className={styles.pagination}>
                    <PlatformPagination
                        meta={pagination}
                        baseUrl={pathname}
                        queryParams={queryParams}
                        onPageChange={(page) => handlePageChange(page)}
                    />
                </div>
            )}

            {/* Глобальная модалка отзыва — одна на всю страницу */}
            <PlatformModal
                isOpen={revokeModal.isOpen}
                onClose={() => setRevokeModal({ isOpen: false, fingerprintId: null })}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Деактивировать ключ?'
                    description='После деактивации вход по этому ключу будет невозможен.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setRevokeModal({ isOpen: false, fingerprintId: null }),
                            disabled: isRevoking
                        },
                        {
                            variant: "accent", 
                            onClick: handleRevoke,
                            children: isRevoking ? 'Деактивация...' : 'Деактивировать',
                            disabled: isRevoking
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}