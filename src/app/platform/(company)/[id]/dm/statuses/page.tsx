'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useParams } from "next/navigation";
import { sectionsList } from "../_sections";
import Plus from "@/assets/ui-kit/icons/plus";
import styles from './page.module.scss';
import { StatusCard } from "../components/status-card/card";
import { useEffect, useState, useRef } from "react";
import { useDm } from "@/apps/company/modules";
import { DealStatus } from "@/apps/company/modules/dm/types";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import clsx from "clsx";
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_STATUSES)
    const ALLOW_STATUS_CREATE = usePermission(PERMISSIONS.DM_STATUSES_CREATE)
    const ALLOW_STATUS_UPDATE = usePermission(PERMISSIONS.DM_STATUSES_UPDATE)

    const dmModule = useDm();
    const { showMessage } = useMessage();
    
    const [statuses, setStatuses] = useState<DealStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        loadStatuses();
    }, []);

    const loadStatuses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dmModule.getDealStatuses();
            
            if (response.status) {
                // Проверяем что statuses существует и это массив
                const statusesData = response.data?.statuses;
                if (Array.isArray(statusesData)) {
                    // Сортируем по sort_order при загрузке
                    const sorted = [...statusesData].sort((a, b) => a.sort_order - b.sort_order);
                    setStatuses(sorted);
                } else {
                    // Если data.statuses null или не массив - пустой массив
                    setStatuses([]);
                }
            } else {
                setStatuses([]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading statuses:', err);
            setStatuses([]); // на всякий случай
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = async () => {
        if (draggedItem === null || dragOverItem.current === null) {
            resetDragState();
            return;
        }

        if (draggedItem === dragOverItem.current) {
            resetDragState();
            return;
        }

        // Копируем массив
        const newStatuses = [...statuses];
        
        // Меняем местами
        const [draggedStatus] = newStatuses.splice(draggedItem, 1);
        newStatuses.splice(dragOverItem.current, 0, draggedStatus);

        // Получаем новый порядок ID
        const newOrderIds = newStatuses.map(s => s.id);

        // Оптимистично обновляем UI
        const updatedStatuses = newStatuses.map((status, idx) => ({
            ...status,
            sort_order: idx + 1
        }));
        setStatuses(updatedStatuses);

        // Отправляем один запрос на реордер
        try {
            await dmModule.reorderDealStatuses(newOrderIds);
            
            showMessage({
                label: 'Порядок статусов обновлен',
                variant: 'success'
            });
        } catch (err) {
            // Если ошибка - откатываем изменения
            await loadStatuses();
            showMessage({
                label: 'Не удалось обновить порядок статусов',
                variant: 'error',
                about: err instanceof Error ? err.message : "Ошибка загрузки"
            });
        }

        resetDragState();
    };

    const resetDragState = () => {
        setDraggedItem(null);
        dragOverItem.current = null;
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!isAllowed(ALLOW_PAGE)) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_STATUSES} />
    )

    return (
        <>
            <PlatformHead
                title='Статусы сделок'
                description='Управление статусами сделок.'
                sections={sectionsList(companyId)}
                actions={isAllowed(ALLOW_STATUS_CREATE) ? [
                    {
                        children: 'Новый статус',
                        icon: <Plus />,
                        variant: 'accent',
                        as: 'link',
                        href: `/platform/${companyId}/dm/statuses/new`
                    }
                ] : undefined }
            />
            <div className={styles.grid}>
                {statuses.map((status, index) => (
                    <div
                        key={status.id}
                        draggable={isAllowed(ALLOW_STATUS_UPDATE)}
                        onDragStart={isAllowed(ALLOW_STATUS_UPDATE) ? (() => handleDragStart(index)) : undefined}
                        onDragEnter={isAllowed(ALLOW_STATUS_UPDATE) ? (() => handleDragEnter(index)) : undefined}
                        onDragEnd={isAllowed(ALLOW_STATUS_UPDATE) ? (handleDragEnd) : undefined}
                        onDragOver={isAllowed(ALLOW_STATUS_UPDATE) ? ((e) => e.preventDefault()) : undefined}
                        className={clsx(styles.item, draggedItem === index && styles.dragged)}
                    >
                        <StatusCard 
                            status={status}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}