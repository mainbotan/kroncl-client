'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import Edit from '@/assets/ui-kit/icons/edit';
import Exit from '@/assets/ui-kit/icons/exit';
import { useEffect, useState } from 'react';
import { TransactionCategory } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { useFm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import { motion } from 'framer-motion';
import { usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformError } from '@/app/platform/components/lib/error/block';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';
import { PlatformHeadAction } from '@/app/platform/components/lib/head/_types';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const categoryId = params.categoryId as string;
    const fmModule = useFm();
    const router = useRouter();
    const { showMessage } = useMessage();

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.FM_TRANSACTIONS_CATEGORIES);
    const ALLOW_CATEGORY_UPDATE = usePermission(PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_UPDATE);
    const ALLOW_CATEGORY_DELETE = usePermission(PERMISSIONS.FM_TRANSACTIONS_CATEGORIES_DELETE);

    const [category, setCategory] = useState<TransactionCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDropOpen, setIsModalDropOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!categoryId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await fmModule.getCategory(categoryId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setCategory(response.data);
                } else {
                    setError("Не удалось загрузить категорию");
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

    const handleDelete = async () => {
        try {
            const response = await fmModule.deleteCategory(category!.id);
            if (response.status) {
                showMessage({
                    label: 'Категория удалена',
                    variant: 'success'
                });
                setIsModalDropOpen(false);
                router.push(`/platform/${companyId}/fm/categories`);
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.';
            showMessage({
                label: 'Не удалось удалить категорию',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    const directionLabel = category?.direction === 'income' ? 'доходов' : 'расходов';
    const isSystem = category?.system;

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!category) return (
        <PlatformError error='Категория не найдена' />
    );

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.FM_TRANSACTIONS_CATEGORIES} />
    )

    const actions: PlatformHeadAction[] = [
        !ALLOW_CATEGORY_UPDATE.isLoading && ALLOW_CATEGORY_UPDATE.allowed && {
            variant: 'accent',
            icon: <Edit />,
            children: 'Редактировать',
            as: 'link',
            href: `/platform/${companyId}/fm/categories/${categoryId}/edit`
        },
        !ALLOW_CATEGORY_DELETE.isLoading && ALLOW_CATEGORY_DELETE.allowed && {
            variant: 'empty',
            icon: <Exit />,
            children: 'Удалить',
            onClick: () => setIsModalDropOpen(true)
        }
    ].filter(Boolean) as PlatformHeadAction[];

    return (
        <>
            <PlatformHead
                title={category.name}
                description={`Категория ${directionLabel} организации.${isSystem ? ' Системная категория.' : ''} ${category.description && category.description}`}
                actions={!isSystem ? actions: []}
            />

            {/* modal delete category */}
            <PlatformModal
                isOpen={isModalDropOpen}
                onClose={() => setIsModalDropOpen(false)}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Удалить категорию?'
                    description={`Категория «${category.name}» будет удалена. Связанные операции останутся без категории, но не удалятся.`}
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDropOpen(false)
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