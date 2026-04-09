'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useWm } from "@/apps/company/modules";
import { CatalogCategory } from "@/apps/company/modules/wm/types";
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
import { getStatusLabel } from "../../../components/category-card/_utils";
import styles from './page.module.scss';
import Link from "next/link";
import clsx from "clsx";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

export default function CategoryPage() {
    const params = useParams();
    const companyId = params.id as string;
    const categoryId = params.categoryId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_CATALOG_CATEGORIES)
    const ALLOW_CATEGORY_UPDATE = usePermission(PERMISSIONS.WM_CATALOG_CATEGORIES_UPDATE);   

    const wmModule = useWm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [category, setCategory] = useState<CatalogCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDeactivateOpen, setIsModalDeactivateOpen] = useState(false);
    const [isModalActivateOpen, setIsModalActivateOpen] = useState(false);

    // загрузка данных категории
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!categoryId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await wmModule.getCategory(categoryId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setCategory(response.data);
                } else {
                    setError("Не удалось загрузить данные категории");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading category ${categoryId}:`, err);
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
    }, [categoryId]);

    const handleDeactivate = async () => {
        try {
            await wmModule.deactivateCategory(category!.id);
            showMessage({
                label: 'Категория деактивирована.',
                variant: 'success'
            });
            setIsModalDeactivateOpen(false);
            // Обновляем данные категории
            const response = await wmModule.getCategory(categoryId);
            if (response.status) {
                setCategory(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось деактивировать категорию.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    const handleActivate = async () => {
        try {
            await wmModule.activateCategory(category!.id);
            showMessage({
                label: 'Категория активирована.',
                variant: 'success'
            });
            setIsModalActivateOpen(false);
            // Обновляем данные категории
            const response = await wmModule.getCategory(categoryId);
            if (response.status) {
                setCategory(response.data);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось активировать категорию.',
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

    if (!category) return (
        <PlatformError error='Не удалось загрузить категорию' />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_CATALOG_CATEGORIES} />
    )

    const isActive = category.status === 'active';
    const statusLabel = getStatusLabel(category.status);

    const actions = (!ALLOW_CATEGORY_UPDATE.isLoading && ALLOW_CATEGORY_UPDATE.allowed) ? [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/wm/${categoryId}/edit`
        }
    ] : [];

    if (!ALLOW_CATEGORY_UPDATE.isLoading && ALLOW_CATEGORY_UPDATE.allowed) {
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
                title={category.name}
                description={`Карточка категории. Создана ${formatDate(category.created_at)}. Статус: ${statusLabel.toLowerCase()}.`}
                actions={actions}
            />

            <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Название</div>
                    <div className={styles.value}>{category.name}</div>
                </section>
                
                {category.comment && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Описание</div>
                        <div className={styles.value}>{category.comment}</div>
                    </section>
                )}
                
                <section className={styles.section}>
                    <div className={styles.capture}>Статус</div>
                    <div className={clsx(styles.value, styles[isActive ? 'active' : 'inactive'])}>
                        {statusLabel}
                    </div>
                </section>

                {category.parent_id && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Родительская категория</div>
                        <Link 
                            href={`/platform/${companyId}/wm/${category.parent_id}`} 
                            className={clsx(styles.value, styles.link)}
                        >
                            Перейти к родительской категории
                        </Link>
                    </section>
                )}

                {category.created_at && (
                    <section className={styles.section}>
                        <div className={styles.capture}>Создана</div>
                        <div className={styles.value}>{formatDate(category.created_at)}</div>
                    </section>
                )}
            </div>

            {/* modal deactivate */}
            <PlatformModal
                isOpen={isModalDeactivateOpen}
                onClose={() => setIsModalDeactivateOpen(false)}
            >
                <PlatformModalConfirmation
                    title='Деактивировать категорию?'
                    description='Категория будет деактивирована. Все связанные товарные позиции сохранятся, но категория не будет доступна для выбора.'
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
                    title='Активировать категорию?'
                    description='Категория будет активирована. Она снова станет доступна для выбора.'
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