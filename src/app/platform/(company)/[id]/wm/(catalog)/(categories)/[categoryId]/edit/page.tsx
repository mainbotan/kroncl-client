'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useState, useEffect } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useWm } from '@/apps/company/modules';
import { useRouter, useParams } from 'next/navigation';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { ChooseCategoryModal } from "../../../../components/choose-category-modal/modal";
import { CatalogCategory } from '@/apps/company/modules/wm/types';
import styles from './page.module.scss';
import { CategoryCard } from "../../../../components/category-card/card";

export default function EditCategoryPage() {
    const wmModule = useWm();
    const { showMessage } = useMessage();
    const router = useRouter();
    const params = useParams();
    const categoryId = params.categoryId as string;
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isFetchingParent, setIsFetchingParent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalChooseCategoryOpen, setIsModalChooseCategoryOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        comment: ''
    });
    
    const [selectedParentCategory, setSelectedParentCategory] = useState<CatalogCategory | null>(null);
    const [originalParentId, setOriginalParentId] = useState<string | null>(null);

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    const loadCategory = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const response = await wmModule.getCategory(categoryId);
            if (response.status) {
                setFormData({
                    name: response.data.name,
                    comment: response.data.comment || ''
                });
                
                // Если есть родительская категория, загружаем её данные
                if (response.data.parent_id) {
                    setOriginalParentId(response.data.parent_id);
                    await loadParentCategory(response.data.parent_id);
                }
            } else {
                throw new Error(response.message || 'Ошибка загрузки категории');
            }
        } catch (err: any) {
            setError(err.message || 'Не удалось загрузить категорию');
            showMessage({
                label: err.message || 'Не удалось загрузить категорию',
                variant: 'error'
            });
        } finally {
            setIsFetching(false);
        }
    };

    const loadParentCategory = async (id: string) => {
        setIsFetchingParent(true);
        try {
            const response = await wmModule.getCategory(id);
            if (response.status) {
                setSelectedParentCategory(response.data);
            }
        } catch (error) {
            console.error('Error loading parent category:', error);
        } finally {
            setIsFetchingParent(false);
        }
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleCategorySelect = (category: CatalogCategory) => {
        setSelectedParentCategory(category);
        setIsModalChooseCategoryOpen(false);
    };

    const handleRemoveParent = () => {
        setSelectedParentCategory(null);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            showMessage({
                label: 'Название категории обязательно',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await wmModule.updateCategory(categoryId, {
                name: formData.name.trim() || undefined,
                comment: formData.comment.trim() || '',
                parent_id: selectedParentCategory?.id || ''
            });

            if (response.status) {
                showMessage({
                    label: 'Категория успешно обновлена',
                    variant: 'success'
                });
                router.back();
            } else {
                throw new Error(response.message || 'Ошибка обновления категории');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить категорию',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
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
    }

    if (error) {
        return (
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
    }

    const isFormValid = formData.name.trim().length > 0;

    return (
        <>
            <PlatformHead
                title='Редактирование категории'
                description="Изменение параметров категории товаров или услуг."
            />
            <PlatformFormBody>
                <PlatformFormSection 
                    title='Родительская категория (опционально)'
                    actions={[
                        {
                            children: selectedParentCategory ? 'Изменить' : 'Выбрать',
                            variant: 'accent',
                            onClick: () => setIsModalChooseCategoryOpen(true),
                            disabled: isLoading || isFetchingParent
                        }
                    ]}
                >
                    {isFetchingParent ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
                            <Spinner />
                        </div>
                    ) : selectedParentCategory ? (
                        <div className={styles.parentBlock}>
                            <CategoryCard 
                                category={selectedParentCategory}
                                compact
                                showDefaultActions={false}
                                actions={[
                                    {
                                        children: 'Убрать',
                                        variant: 'light',
                                        onClick: handleRemoveParent,
                                        disabled: isLoading
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <div className={styles.emptyParent}>
                            Корневая категория
                        </div>
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Название категории'>
                    <PlatformFormInput
                        placeholder="Например: Электроника"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>
                
                <PlatformFormSection title='Описание (опционально)'>
                    <PlatformFormInput
                        placeholder="Краткое описание категории"
                        value={formData.comment}
                        onChange={handleCommentChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>
                
                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </section>
            </PlatformFormBody>

            {/* выбор родительской категории */}
            <PlatformModal
                isOpen={isModalChooseCategoryOpen}
                onClose={() => setIsModalChooseCategoryOpen(false)}
                className={styles.modal}
            >
                <ChooseCategoryModal onSelectCategory={handleCategorySelect} />
            </PlatformModal>
        </>
    );
}