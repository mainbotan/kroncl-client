'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useDm } from "@/apps/company/modules";
import { DealStatus } from "@/apps/company/modules/dm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { motion } from 'framer-motion';
import styles from './page.module.scss';
import Exit from "@/assets/ui-kit/icons/exit";
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { DOCS_LINK_DM_STATUSES } from "@/app/docs/(v1)/internal.config";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const statusId = params.statusId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_STATUSES)
    const ALLOW_STATUS_UPDATE = usePermission(PERMISSIONS.DM_STATUSES_UPDATE)
    const ALLOW_STATUS_DELETE = usePermission(PERMISSIONS.DM_STATUSES_DELETE)

    const dmModule = useDm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [status, setStatus] = useState<DealStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false); // для блокировки двойного нажатия

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!statusId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await dmModule.getDealStatus(statusId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setStatus(response.data);
                } else {
                    setError("Не удалось загрузить данные статуса");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading status ${statusId}:`, err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        fetchData();
        
        return () => {
            isMounted = false;
        };
    }, [statusId]);

    const handleDelete = async () => {
        // Блокируем повторные нажатия
        if (isDeleting) return;
        
        setIsDeleting(true);
        
        try {
            await dmModule.deleteDealStatus(status!.id);
            
            // Сначала закрываем модалку (до показа сообщения)
            setIsModalDeleteOpen(false);
            
            showMessage({
                label: 'Статус удален.',
                variant: 'success'
            });
            
            router.push(`/platform/${companyId}/dm/statuses`);
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            
            // Закрываем модалку ПРИ ЛЮБОМ ИСХОДЕ
            setIsModalDeleteOpen(false);
            
            // Показываем ошибку
            showMessage({
                label: 'Не удалось удалить статус.',
                variant: 'error',
                about: errorMessage
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error || !status) return (
        <PlatformError error={error || 'Не удалось загрузить статус'} />
    );

    if (!isAllowed(ALLOW_PAGE)) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_STATUSES} />
    )

    const actions = isAllowed(ALLOW_STATUS_UPDATE) ? [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/dm/statuses/${statusId}/edit`
        }
    ] : [];

    if (isAllowed(ALLOW_STATUS_DELETE)) {
        actions.push({
            children: 'Удалить',
            icon: <Exit />,
            variant: 'light' as const,
            onClick: () => setIsModalDeleteOpen(true)
        })
    }

    return (
        <>
            <PlatformHead
                title={status.name}
                description={`Статус сделки. Создан ${formatDate(status.created_at)} Порядок: ${status.sort_order}.`}
                actions={actions}
                docsEscort={{
                    href: DOCS_LINK_DM_STATUSES,
                    title: 'Подробнее о статусах сделок'
                }}
            />

            <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Название</div>
                    <div className={styles.value}>{status.name}</div>
                </section>

                <section className={styles.section}>
                    <div className={styles.capture}>Цвет</div>
                    <div className={styles.value}>
                        <span style={{ 
                            display: 'inline-block', 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: status.color || '#000000',
                            borderRadius: '4px',
                            marginRight: '8px',
                            verticalAlign: 'middle'
                        }} />
                        {status.color || 'Не указан'}
                    </div>
                </section>

                {/* Новая секция с дефолтным флагом */}
                <section className={styles.section}>
                    <div className={styles.capture}>По умолчанию</div>
                    <div className={styles.value}>
                        {status.is_default ? (
                            <span style={{ color: 'var(--color-success)' }}>Да</span>
                        ) : 'Нет'}
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.capture}>Порядок</div>
                    <div className={styles.value}>{status.sort_order}</div>
                </section>

                {status.comment && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Комментарий</div>
                        <div className={styles.value}>{status.comment}</div>
                    </section>
                )}

                <section className={styles.section}>
                    <div className={styles.capture}>Создан</div>
                    <div className={styles.value}>{formatDate(status.created_at)}</div>
                </section>

                <section className={styles.section}>
                    <div className={styles.capture}>Обновлен</div>
                    <div className={styles.value}>{formatDate(status.updated_at)}</div>
                </section>
            </div>

            {/* modal delete */}
            <PlatformModal
                isOpen={isModalDeleteOpen}
                onClose={() => setIsModalDeleteOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Удалить статус?'
                    description='Статус будет удален. Убедитесь, что он не используется в сделках.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDeleteOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDelete,
                            children: 'Удалить',
                            disabled: isDeleting // дизейблим кнопку во время удаления
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}