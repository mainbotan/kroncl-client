'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useWm } from "@/apps/company/modules";
import { CatalogUnit } from "@/apps/company/modules/wm/types";
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
import Link from "next/link";
import clsx from "clsx";
import { getTrackingDetailLabel, getTrackedTypeLabel } from "./_utils";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { DOCS_LINK_WM_CATALOG_UNITS } from "@/app/docs/(v1)/internal.config";

export default function UnitPage() {
    const params = useParams();
    const companyId = params.id as string;
    const unitId = params.unitId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_CATALOG_UNITS)
    const ALLOW_UNIT_UPDATE = usePermission(PERMISSIONS.WM_CATALOG_UNITS_UPDATE)

    const wmModule = useWm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [unit, setUnit] = useState<CatalogUnit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeactivateOpen, setIsModalDeactivateOpen] = useState(false);
    const [isModalActivateOpen, setIsModalActivateOpen] = useState(false);
    const [parentCategory, setParentCategory] = useState<{ id: string; name: string } | null>(null);

    // загрузка данных позиции
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!unitId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await wmModule.getUnit(unitId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setUnit(response.data);
                    
                    // Если есть категория, загружаем её для отображения названия
                    if (response.data.category_id) {
                        try {
                            const categoryResponse = await wmModule.getCategory(response.data.category_id);
                            if (categoryResponse.status) {
                                setParentCategory({
                                    id: categoryResponse.data.id,
                                    name: categoryResponse.data.name
                                });
                            }
                        } catch (err) {
                            console.error('Error loading category:', err);
                        }
                    }
                } else {
                    setError("Не удалось загрузить данные позиции");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading unit ${unitId}:`, err);
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
    }, [unitId]);

    const handleDeactivate = async () => {
        try {
            await wmModule.deactivateUnit(unit!.id);
            showMessage({
                label: 'Товарная позиция деактивирована.',
                variant: 'success'
            });
            setIsModalDeactivateOpen(false);
            // Обновляем данные позиции
            const response = await wmModule.getUnit(unitId);
            if (response.status) {
                setUnit(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось деактивировать позицию.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    const handleActivate = async () => {
        try {
            await wmModule.activateUnit(unit!.id);
            showMessage({
                label: 'Товарная позиция активирована.',
                variant: 'success'
            });
            setIsModalActivateOpen(false);
            // Обновляем данные позиции
            const response = await wmModule.getUnit(unitId);
            if (response.status) {
                setUnit(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось активировать позицию.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!unit) return (
        <PlatformError error='Не удалось загрузить позицию' />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_CATALOG_UNITS} />
    )

    const isActive = unit.status === 'active';
    const typeLabel = unit.type === 'product' ? 'Товар' : 'Услуга';
    const inventoryLabel = unit.inventory_type === 'tracked' ? 'Складской учет' : 'Без учета';
    const trackingDetailLabel = unit.tracking_detail ? getTrackingDetailLabel(unit.tracking_detail) : null; // НОВОЕ
    const trackedLabel = unit.tracked_type ? getTrackedTypeLabel(unit.tracked_type) : null; // ИСПРАВЛЕНО

    const actions = (!ALLOW_UNIT_UPDATE.isLoading && ALLOW_UNIT_UPDATE.allowed) ? [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/wm/units/${unitId}/edit`
        }
    ] : [];

    if (!ALLOW_UNIT_UPDATE.isLoading && ALLOW_UNIT_UPDATE.allowed) {
        if (isActive) {
            actions.push({
                children: 'Деактивировать',
                icon: <Exit />,
                variant: 'light',
                onClick: () => setIsModalDeactivateOpen(true)
            });
        } else {
            actions.push({
                children: 'Активировать',
                icon: <Exit />,
                variant: 'accent',
                onClick: () => setIsModalActivateOpen(true)
            });
        }
    }

    return (
        <>
            <PlatformHead
                title={unit.name}
                description={`Карточка товарной позиции. Создана ${formatDate(unit.created_at)}. Статус: ${isActive ? 'активна' : 'неактивна'}.`}
                actions={actions}
                docsEscort={{
                    href: DOCS_LINK_WM_CATALOG_UNITS,
                    title: 'Подробнее о товарных позициях'
                }}
            />

            <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Название</div>
                    <div className={styles.value}>{unit.name}</div>
                </section>
                
                {unit.comment && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Описание</div>
                        <div className={styles.value}>{unit.comment}</div>
                    </section>
                )}
                
                <section className={styles.section}>
                    <div className={styles.capture}>Тип</div>
                    <div className={styles.value}>{typeLabel}</div>
                </section>

                <section className={styles.section}>
                    <div className={styles.capture}>Статус</div>
                    <div className={clsx(styles.value, styles[isActive ? 'active' : 'inactive'])}>
                        {isActive ? 'Активна' : 'Неактивна'}
                    </div>
                </section>

                {parentCategory && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Категория</div>
                        <Link 
                            href={`/platform/${companyId}/wm/categories/${parentCategory.id}`}
                            className={clsx(styles.value, styles.link)}
                        >
                            {parentCategory.name}
                        </Link>
                    </section>
                )}

                <section className={styles.section}>
                    <div className={styles.capture}>Единица измерения</div>
                    <div className={styles.value}>{unit.unit}</div>
                </section>

                <section className={styles.section}>
                    <div className={styles.capture}>Тип учета</div>
                    <div className={styles.value}>{inventoryLabel}</div>
                </section>

                {/* НОВАЯ СЕКЦИЯ: Детализация учета */}
                {unit.inventory_type === 'tracked' && unit.tracking_detail && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Детализация учета</div>
                        <div className={styles.value}>{trackingDetailLabel}</div>
                    </section>
                )}

                {/* ИСПРАВЛЕНО: теперь показывает нормальный текст для FIFO/LIFO */}
                {unit.inventory_type === 'tracked' && unit.tracking_detail === 'batch' && unit.tracked_type && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Метод учета</div>
                        <div className={styles.value}>{trackedLabel}</div>
                    </section>
                )}

                <section className={styles.section}>
                    <div className={styles.capture}>Цена продажи</div>
                    <div className={styles.value}>{unit.sale_price ? unit.sale_price.toLocaleString() : 0} ₽</div>
                </section>

                {unit.purchase_price !== null && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Цена закупки</div>
                        <div className={styles.value}>{unit.purchase_price ? unit.purchase_price.toLocaleString() : 0} ₽</div>
                    </section>
                )}

                {unit.created_at && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Создана</div>
                        <div className={styles.value}>{formatDate(unit.created_at)}</div>
                    </section>
                )}
            </div>

            {/* modal deactivate */}
            <PlatformModal
                isOpen={isModalDeactivateOpen}
                onClose={() => setIsModalDeactivateOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Деактивировать позицию?'
                    description='Товарная позиция будет деактивирована. Она не будет доступна для выбора в операциях.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDeactivateOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDeactivate,
                            children: 'Деактивировать'
                        }
                    ]}
                />
            </PlatformModal>

            {/* modal activate */}
            <PlatformModal
                isOpen={isModalActivateOpen}
                onClose={() => setIsModalActivateOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Активировать позицию?'
                    description='Товарная позиция будет активирована. Она снова станет доступна для выбора.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalActivateOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleActivate,
                            children: 'Активировать'
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}