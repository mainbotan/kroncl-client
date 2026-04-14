'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useHrm } from "@/apps/company/modules";
import { Position } from "@/apps/company/modules/hrm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from './page.module.scss';
import Button from "@/assets/ui-kit/button/button";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import { motion } from 'framer-motion';
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import Exit from "@/assets/ui-kit/icons/exit";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const positionId = params.positionId as string;

    const ALLOW_PAGE = usePermission(PERMISSIONS.HRM_POSITIONS);
    const ALLOW_UPDATE = usePermission(PERMISSIONS.HRM_POSITIONS_UPDATE);
    const ALLOW_DELETE = usePermission(PERMISSIONS.HRM_POSITIONS_DELETE);

    const hrmModule = useHrm();
    const router = useRouter();

    const [position, setPosition] = useState<Position | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const { showMessage } = useMessage();

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!positionId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await hrmModule.getPosition(positionId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setPosition(response.data);
                } else {
                    setError("Не удалось загрузить данные должности");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading position ${positionId}:`, err);
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
    }, [positionId]);

    const handleDelete = async () => {
        try {
            const response = await hrmModule.deletePosition(position!.id);
            if (response.status) {
                showMessage({
                    label: 'Должность удалена',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/hrm/positions`);
            } else {
                throw new Error(response.message || 'Ошибка удаления должности');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось удалить должность',
                variant: 'error'
            });
        } finally {
            setIsModalDeleteOpen(false);
        }
    };

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.HRM_POSITIONS} />
    );

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!position) return (
        <PlatformError error='Не удалось загрузить должность' />
    );

    const actions = [];
    
    if (isAllowed(ALLOW_UPDATE)) {
        actions.push({
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/hrm/positions/${positionId}/edit`
        });
    }
    
    if (isAllowed(ALLOW_DELETE)) {
        actions.push({
            children: 'Удалить',
            icon: <Exit />,
            variant: 'accent' as const,
            onClick: () => setIsModalDeleteOpen(true)
        });
    }

    return (
        <>
            <PlatformHead
                title={position.name}
                description={`Должность создана ${formatDate(position.created_at)}. ${position.description ? position.description : ''}`}
                actions={actions}
            />
            
            <PlatformModal
                isOpen={isModalDeleteOpen}
                onClose={() => setIsModalDeleteOpen(false)}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Удалить должность?'
                    description='Должность будет удалена безвозвратно. Сотрудники, занимавшие эту должность, останутся без неё.'
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