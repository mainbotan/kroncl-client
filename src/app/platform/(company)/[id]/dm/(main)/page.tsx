'use client';

import PlatformContent from '@/app/platform/components/content/content';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { useParams } from 'next/navigation';
import { sectionsList } from '../_sections';
import Plus from '@/assets/ui-kit/icons/plus';
import { DealCard } from '../components/deal-card/card';
import { useEffect, useState, useRef } from 'react';
import { useDm } from '@/apps/company/modules';
import { DealGroup } from '@/apps/company/modules/dm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    
    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_DEALS)
    const ALLOW_DEAL_CREATE = usePermission(PERMISSIONS.DM_DEALS_CREATE)
    const ALLOW_DEAL_UPDATE = usePermission(PERMISSIONS.DM_DEALS_UPDATE)

    const dmModule = useDm();
    const { showMessage } = useMessage();
    const [data, setData] = useState<DealGroup[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [draggedDeal, setDraggedDeal] = useState<any>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await dmModule.getDeals({
                group_by: 'status'
            });
            
            if (response.status) {
                setData(response.data as DealGroup[]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading deals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, deal: any) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            id: deal.id,
            currentStatusId: deal.status?.id
        }));
        e.dataTransfer.effectAllowed = 'move';
        setDraggedDeal(deal);
        
        // Добавляем класс для элемента
        const target = e.target as HTMLElement;
        target.classList.add(styles.dragging);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        const target = e.target as HTMLElement;
        target.classList.remove(styles.dragging);
        setDraggedDeal(null);
        setDragOverCol(null);
    };

    const handleDragOver = (e: React.DragEvent, statusId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverCol(statusId);
    };

    const handleDragLeave = () => {
        setDragOverCol(null);
    };

    const handleDrop = async (e: React.DragEvent, targetStatusId: string) => {
        e.preventDefault();
        setDragOverCol(null);
        
        try {
            const dealData = JSON.parse(e.dataTransfer.getData('text/plain'));
            
            // Если статус не изменился - ничего не делаем
            if (dealData.currentStatusId === targetStatusId) {
                return;
            }

            const response = await dmModule.updateDeal(dealData.id, {
                status_id: targetStatusId
            });

            if (response.status) {
                showMessage({
                    label: 'Статус сделки обновлен',
                    variant: 'success'
                });
                
                // Обновляем данные
                await loadData();
            } else {
                throw new Error(response.message || 'Ошибка обновления статуса');
            }
        } catch (err: any) {
            showMessage({
                label: err.message || 'Не удалось обновить статус сделки',
                variant: 'error'
            });
            console.error('Drop error:', err);
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_DEALS} />
    )

    const sortedGroups = data?.sort((a, b) => a.sort_order - b.sort_order) || [];

    return (
        <>
        <PlatformHead
            title={`Сделки`}
            description='Управление текущими сделками.'
            sections={sectionsList(companyId)}
            actions={(!ALLOW_DEAL_CREATE.isLoading && ALLOW_DEAL_CREATE.allowed) ? [
                {
                    children: 'Новая сделка',
                    icon: <Plus />,
                    variant: 'accent',
                    as: 'link',
                    href: `/platform/${companyId}/dm/new`
                }
            ] : undefined}
        />
        <div className={styles.canvas}>
            <div className={styles.grid}>
                {sortedGroups.map((group) => (
                    <div 
                        key={group.status_id} 
                        draggable={isAllowed(ALLOW_DEAL_UPDATE)}
                        className={`${styles.col} ${dragOverCol === group.status_id ? styles.dragOver : ''}`}
                        onDragOver={(!ALLOW_DEAL_UPDATE.isLoading && ALLOW_DEAL_UPDATE.allowed) ? ((e) => handleDragOver(e, group.status_id)) : undefined}
                        onDragLeave={(!ALLOW_DEAL_UPDATE.isLoading && ALLOW_DEAL_UPDATE.allowed) ? (handleDragLeave) : undefined}
                        onDrop={(!ALLOW_DEAL_UPDATE.isLoading && ALLOW_DEAL_UPDATE.allowed) ? ((e) => handleDrop(e, group.status_id)) : undefined}
                    >
                        <div className={styles.head}>
                            <span className={styles.title}>
                                {group.status_name} <span className={styles.secondary}>{group.count}</span>
                            </span>
                            <span className={styles.mark} style={{backgroundColor: `${group.status_color}`}} />
                        </div>
                        <div className={styles.deals}>
                            {group.deals?.map((deal) => (
                                <DealCard 
                                    key={deal.id} 
                                    deal={deal} 
                                    className={styles.item}
                                    draggable={true}
                                    onDragStart={(e) => handleDragStart(e, deal)}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}