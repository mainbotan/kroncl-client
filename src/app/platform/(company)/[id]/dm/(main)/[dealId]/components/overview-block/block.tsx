'use client';

import clsx from 'clsx';
import { DealBlock } from '../block/block';
import styles from './block.module.scss';
import { StatusBlock } from './components/status-block/block';
import { PlatformFormBody, PlatformFormSection, PlatformFormTextarea, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { DealStatus, DealType } from '@/apps/company/modules/dm/types';
import { useEffect, useState } from 'react';
import { useDm } from '@/apps/company/modules';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { formatDate } from '@/assets/utils/date';
import { PlatformDangerZone } from '@/app/platform/components/lib/danger-zone/block';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useRouter, useParams } from 'next/navigation';

export interface OverviewBlockProps {
    className?: string;
    dealId: string;
    currentStatus: DealStatus | null;
    currentType: DealType | null;
    currentComment: string | null;
    onStatusChange: (statusId: string) => void;
    onTypeChange: (typeId: string | null) => void;
    onCommentChange: (comment: string) => void;
    disabled?: boolean;
    created_at?: string;
    updated_at?: string;
}

export function OverviewBlock({
    className,
    dealId,
    currentStatus,
    currentType,
    currentComment,
    onStatusChange,
    onTypeChange,
    onCommentChange,
    disabled,
    created_at,
    updated_at
}: OverviewBlockProps) {
    const dmModule = useDm();
    const router = useRouter();
    const params = useParams();
    const companyId = params.id as string;
    const { showMessage } = useMessage();

    const ALLOW_UPDATE = usePermission(PERMISSIONS.DM_DEALS_UPDATE);
    const ALLOW_DELETE = usePermission(PERMISSIONS.DM_DEALS_DELETE);
    const canEdit = isAllowed(ALLOW_UPDATE) && !disabled;
    const canDelete = isAllowed(ALLOW_DELETE) && !disabled;

    const [statuses, setStatuses] = useState<DealStatus[]>([]);
    const [types, setTypes] = useState<DealType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [statusesRes, typesRes] = await Promise.all([
                    dmModule.getDealStatuses({ limit: 100 }),
                    dmModule.getDealTypes({ limit: 100 })
                ]);

                if (statusesRes.status) {
                    const sorted = statusesRes.data.statuses?.sort((a, b) => a.sort_order - b.sort_order);
                    setStatuses(sorted);
                }

                if (typesRes.status) {
                    setTypes(typesRes.data.deal_types || []);
                }
            } catch (error) {
                console.error('Error loading overview data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const typeOptions = [
        { value: '', label: 'Без типа', description: 'Сделка не привязана к типу' },
        ...types.map(t => ({
            value: t.id,
            label: t.name,
            description: t.comment || undefined
        }))
    ];

    const currentTypeValue = currentType?.id || '';

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await dmModule.deleteDeal(dealId);
            if (response.status) {
                showMessage({
                    label: 'Сделка удалена',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/dm`);
            } else {
                throw new Error(response.message || 'Ошибка удаления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось удалить сделку',
                variant: 'error'
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const dangerZoneItems = [];

    if (canDelete) {
        dangerZoneItems.push({
            title: 'Удалить сделку',
            description: 'Безвозвратное удаление всей информации о сделке.',
            actions: [
                {
                    variant: 'red' as const,
                    children: 'Удалить навсегда',
                    onClick: () => setIsDeleteModalOpen(true)
                }
            ]
        });
    }

    if (loading) {
        return (
            <DealBlock title='Обзор сделки' description='Основная информация о заказе.' className={className}>
                <div className={styles.loading}><Spinner /></div>
            </DealBlock>
        );
    }

    return (
        <>
            <DealBlock
                title='Обзор сделки'
                description='Основная информация о заказе.'
                className={className}
            >
                <div className={styles.container}>
                    <StatusBlock
                        className={styles.block}
                        statuses={statuses}
                        currentStatusId={currentStatus?.id || null}
                        onStatusChange={canEdit ? onStatusChange : undefined}
                    />
                    <PlatformFormBody className={clsx(styles.block, styles.form)}>
                        <PlatformFormSection title='Тип' description='Классификация заказов'>
                            <PlatformFormVariants
                                value={currentTypeValue}
                                options={typeOptions}
                                onChange={(value) => onTypeChange(value || null)}
                                disabled={!canEdit}
                            />
                        </PlatformFormSection>
                        <PlatformFormSection title='Комментарий' description='Дополнительная информация по заказу'>
                            <PlatformFormTextarea
                                value={currentComment || ''}
                                onChange={onCommentChange}
                                disabled={!canEdit}
                                placeholder="Комментарий к сделке..."
                            />
                        </PlatformFormSection>
                        {updated_at && (<PlatformFormSection title='Последнее обновление' description={formatDate(updated_at)} children={undefined}/>)}
                        {created_at && (<PlatformFormSection title='Создание' description={formatDate(created_at)} children={undefined}/>)}
                    </PlatformFormBody>

                    {dangerZoneItems.length > 0 && (
                        <PlatformDangerZone
                            className={styles.dangerZone}
                            description='Эти действия могут быть необратимыми.'
                            items={dangerZoneItems}
                        />
                    )}
                </div>
            </DealBlock>

            <PlatformModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Удалить сделку?'
                    description='Сделка будет безвозвратно удалена. Все связи с объектами модулей (позиции, ответственные, клиент...) будут потеряны.'
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setIsDeleteModalOpen(false),
                            disabled: isDeleting
                        },
                        {
                            variant: 'red',
                            onClick: handleDelete,
                            children: isDeleting ? 'Удаление...' : 'Удалить',
                            disabled: isDeleting
                        }
                    ]}
                />
            </PlatformModal>
        </>
    )
}