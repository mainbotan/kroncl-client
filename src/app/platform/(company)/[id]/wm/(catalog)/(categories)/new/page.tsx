'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import { useState, useEffect } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useWm } from '@/apps/company/modules';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { ChooseCategoryModal } from "../../../components/choose-category-modal/modal";
import { CatalogCategory } from '@/apps/company/modules/wm/types';
import styles from './page.module.scss';
import { CategoryCard } from "../../../components/category-card/card";
import Spinner from '@/assets/ui-kit/spinner/spinner';

export default function NewCategoryPage() {
    const wmModule = useWm();
    const { showMessage } = useMessage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const parentId = searchParams.get('parent_id');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingParent, setIsFetchingParent] = useState(!!parentId);
    const [isModalChooseCategoryOpen, setIsModalChooseCategoryOpen] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState<CatalogCategory | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        comment: ''
    });

    // Загружаем родительскую категорию если есть parent_id
    useEffect(() => {
        if (parentId) {
            loadParentCategory(parentId);
        }
    }, [parentId]);

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
            const response = await wmModule.createCategory({
                name: formData.name.trim(),
                comment: formData.comment.trim() || undefined,
                parent_id: selectedParentCategory?.id || parentId || undefined
            });

            if (response.status) {
                showMessage({
                    label: 'Категория успешно создана',
                    variant: 'success'
                });
                router.back();
            } else {
                throw new Error(response.message || 'Ошибка создания категории');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать категорию',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.name.trim().length > 0;

    return (
        <>
            <PlatformHead
                title='Новая категория'
                description="Создание новой категории товаров или услуг."
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
                        {isLoading ? 'Создание...' : 'Создать категорию'}
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