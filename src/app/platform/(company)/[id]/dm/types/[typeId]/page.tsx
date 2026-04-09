'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useDm } from "@/apps/company/modules";
import { DealType } from "@/apps/company/modules/dm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Exit from "@/assets/ui-kit/icons/exit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { motion } from 'framer-motion';
import styles from './page.module.scss';
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const typeId = params.typeId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_TYPES)
    const ALLOW_TYPE_DELETE = usePermission(PERMISSIONS.DM_TYPES_DELETE)
    const ALLOW_TYPE_UPDATE = usePermission(PERMISSIONS.DM_TYPES_UPDATE)

    const dmModule = useDm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [type, setType] = useState<DealType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!typeId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await dmModule.getDealType(typeId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setType(response.data);
                } else {
                    setError("Не удалось загрузить данные типа");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading type ${typeId}:`, err);
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
    }, [typeId]);

    const handleDelete = async () => {
        try {
            await dmModule.deleteDealType(type!.id);
            showMessage({
                label: 'Тип удален.',
                variant: 'success'
            });
            setIsModalDeleteOpen(false);
            router.push(`/platform/${companyId}/dm/types`);
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось удалить тип.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error || !type) return (
        <PlatformError error={error || 'Не удалось загрузить тип'} />
    );

    const actions = isAllowed(ALLOW_TYPE_UPDATE) ? [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/dm/types/${typeId}/edit`
        }
    ] : [];

    if (isAllowed(ALLOW_TYPE_DELETE)) {
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
                title={type.name}
                description={`Тип сделки. Создан ${formatDate(type.created_at)}.`}
                actions={actions}
            />

            <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Название</div>
                    <div className={styles.value}>{type.name}</div>
                </section>

                {type.comment && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Комментарий</div>
                        <div className={styles.value}>{type.comment}</div>
                    </section>
                )}

                <section className={styles.section}>
                    <div className={styles.capture}>Создан</div>
                    <div className={styles.value}>{formatDate(type.created_at)}</div>
                </section>

                <section className={styles.section}>
                    <div className={styles.capture}>Обновлен</div>
                    <div className={styles.value}>{formatDate(type.updated_at)}</div>
                </section>
            </div>

            {/* modal delete */}
            <PlatformModal
                isOpen={isModalDeleteOpen}
                onClose={() => setIsModalDeleteOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Удалить тип?'
                    description='Тип будет удален. Убедитесь, что он не используется в сделках.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDeleteOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDelete,
                            children: 'Удалить'
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}