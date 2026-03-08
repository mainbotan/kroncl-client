'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import { useState, useEffect } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useWm } from '@/apps/company/modules';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { ChooseCategoryModal } from "../../../components/choose-category-modal/modal";
import { CatalogCategory, UnitType, InventoryType, TrackedType } from '@/apps/company/modules/wm/types';
import styles from './page.module.scss';
import { CategoryCard } from "../../../components/category-card/card";
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { _units } from "./_units";

export default function NewUnitPage() {
    const wmModule = useWm();
    const { showMessage } = useMessage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('category_id');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCategory, setIsFetchingCategory] = useState(!!categoryId);
    const [isModalChooseCategoryOpen, setIsModalChooseCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        comment: '',
        type: 'product' as UnitType,
        inventory_type: 'tracked' as InventoryType,
        tracked_type: 'fifo' as TrackedType,
        unit: '',
        sale_price: '',
        purchase_price: '',
        currency: 'RUB' as const
    });

    // Загружаем категорию если есть category_id
    useEffect(() => {
        if (categoryId) {
            loadCategory(categoryId);
        }
    }, [categoryId]);

    const loadCategory = async (id: string) => {
        setIsFetchingCategory(true);
        try {
            const response = await wmModule.getCategory(id);
            if (response.status) {
                setSelectedCategory(response.data);
            }
        } catch (error) {
            console.error('Error loading category:', error);
        } finally {
            setIsFetchingCategory(false);
        }
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleTypeChange = (value: string) => {
        const newType = value as UnitType;
        setFormData(prev => ({ 
            ...prev, 
            type: newType,
            // Сбрасываем inventory_type при смене типа
            inventory_type: newType === 'service' ? 'untracked' : prev.inventory_type,
            // Для услуги убираем purchase_price
            purchase_price: newType === 'service' ? '' : prev.purchase_price
        }));
    };

    const handleInventoryTypeChange = (value: string) => {
        setFormData(prev => ({ 
            ...prev, 
            inventory_type: value as InventoryType,
            // Если выбрали untracked, убираем tracked_type и purchase_price
            ...(value === 'untracked' ? { 
                tracked_type: undefined,
                purchase_price: ''
            } : {})
        }));
    };

    const handleTrackedTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, tracked_type: value as TrackedType }));
    };

    const handleUnitChange = (value: string) => {
        setFormData(prev => ({ ...prev, unit: value }));
    };

    const handleSalePriceChange = (value: string) => {
        // Разрешаем только числа и точку
        const cleaned = value.replace(/[^\d.]/g, '');
        setFormData(prev => ({ ...prev, sale_price: cleaned }));
    };

    const handlePurchasePriceChange = (value: string) => {
        // Разрешаем только числа и точку
        const cleaned = value.replace(/[^\d.]/g, '');
        setFormData(prev => ({ ...prev, purchase_price: cleaned }));
    };

    const handleCategorySelect = (category: CatalogCategory) => {
        setSelectedCategory(category);
        setIsModalChooseCategoryOpen(false);
    };

    const handleRemoveCategory = () => {
        setSelectedCategory(null);
    };

    const handleSubmit = async () => {
        // Валидация
        if (!formData.name.trim()) {
            showMessage({ label: 'Название обязательно', variant: 'error' });
            return;
        }

        if (!selectedCategory) {
            showMessage({ label: 'Выберите категорию', variant: 'error' });
            return;
        }

        if (!formData.unit.trim()) {
            showMessage({ label: 'Укажите единицу измерения', variant: 'error' });
            return;
        }

        const salePrice = parseFloat(formData.sale_price);
        if (isNaN(salePrice) || salePrice < 0) {
            showMessage({ label: 'Укажите корректную цену продажи', variant: 'error' });
            return;
        }

        // Для tracked товаров проверяем purchase_price и tracked_type
        if (formData.inventory_type === 'tracked') {
            const purchasePrice = parseFloat(formData.purchase_price);
            if (isNaN(purchasePrice) || purchasePrice < 0) {
                showMessage({ label: 'Укажите корректную закупочную цену', variant: 'error' });
                return;
            }
            if (!formData.tracked_type) {
                showMessage({ label: 'Укажите тип учета (FIFO/LIFO)', variant: 'error' });
                return;
            }
        }

        // Для услуги проверяем что inventory_type = untracked
        if (formData.type === 'service' && formData.inventory_type !== 'untracked') {
            showMessage({ label: 'Услуги не могут быть tracked', variant: 'error' });
            return;
        }

        setIsLoading(true);
        try {
            const request: any = {
                name: formData.name.trim(),
                comment: formData.comment.trim() || undefined,
                type: formData.type,
                inventory_type: formData.inventory_type,
                unit: formData.unit.trim(),
                sale_price: parseFloat(formData.sale_price),
                currency: 'RUB',
                category_id: selectedCategory.id
            };

            // Добавляем status (по умолчанию active)
            request.status = 'active';

            // Добавляем tracked_type для tracked товаров
            if (formData.inventory_type === 'tracked') {
                request.tracked_type = formData.tracked_type;
                request.purchase_price = parseFloat(formData.purchase_price);
            }

            const response = await wmModule.createUnit(request);

            if (response.status) {
                showMessage({
                    label: 'Товарная позиция успешно создана',
                    variant: 'success'
                });
                router.back();
            } else {
                throw new Error(response.message || 'Ошибка создания');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать позицию',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = () => {
        if (!formData.name.trim()) return false;
        if (!selectedCategory) return false;
        if (!formData.unit.trim()) return false;
        
        const salePrice = parseFloat(formData.sale_price);
        if (isNaN(salePrice) || salePrice < 0) return false;
        
        if (formData.inventory_type === 'tracked') {
            const purchasePrice = parseFloat(formData.purchase_price);
            if (isNaN(purchasePrice) || purchasePrice < 0) return false;
            if (!formData.tracked_type) return false;
        }
        
        if (formData.type === 'service' && formData.inventory_type !== 'untracked') return false;
        
        return true;
    };

    return (
        <>
            <PlatformHead
                title='Новая товарная позиция'
                description="Создание новой позиции в каталоге товаров и услуг."
            />
            <PlatformFormBody>
                <PlatformFormSection 
                    title='Категория'
                    actions={[
                        {
                            children: selectedCategory ? 'Изменить' : 'Выбрать',
                            variant: 'accent',
                            onClick: () => setIsModalChooseCategoryOpen(true),
                            disabled: isLoading || isFetchingCategory
                        }
                    ]}
                >
                    {isFetchingCategory ? (
                        <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
                            <Spinner />
                        </div>
                    ) : selectedCategory ? (
                        <div className={styles.parentBlock}>
                            <CategoryCard 
                                category={selectedCategory}
                                compact
                                showDefaultActions={false}
                                actions={[
                                    {
                                        children: 'Убрать',
                                        variant: 'light',
                                        onClick: handleRemoveCategory,
                                        disabled: isLoading
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <div className={styles.emptyParent}>
                            Категория не выбрана
                        </div>
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Название'>
                    <PlatformFormInput
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Тип'>
                    <PlatformFormVariants
                        options={[
                            { value: 'product', label: 'Товар' },
                            { value: 'service', label: 'Услуга' }
                        ]}
                        value={formData.type}
                        onChange={handleTypeChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Тип учета'>
                    <PlatformFormVariants
                        options={[
                            { 
                                value: 'tracked', 
                                label: 'Складской учет',
                                description: 'Отслеживание остатков на складе с FIFO/LIFO методом',
                                disabled: formData.type === 'service' 
                            },
                            { 
                                value: 'untracked', 
                                label: 'Без учета',
                                description: 'Позиция не учитывается на складе (цифровые товары, услуги)'
                            }
                        ]}
                        value={formData.inventory_type}
                        onChange={handleInventoryTypeChange}
                        disabled={isLoading || formData.type === 'service'}
                    />
                </PlatformFormSection>

                {formData.inventory_type === 'tracked' && (
                    <PlatformFormSection title='Метод учета'>
                        <PlatformFormVariants
                            options={[
                                { 
                                    value: 'fifo', 
                                    label: 'FIFO',
                                    description: 'Первым пришел — первым ушел (First In, First Out). Подходит для скоропортящихся товаров.'
                                },
                                { 
                                    value: 'lifo', 
                                    label: 'LIFO',
                                    description: 'Последним пришел — первым ушел (Last In, First Out). Используется для не скоропортящихся товаров.'
                                }
                            ]}
                            value={formData.tracked_type || 'fifo'}
                            onChange={handleTrackedTypeChange}
                            disabled={isLoading}
                        />
                    </PlatformFormSection>
                )}

                <PlatformFormSection title='Единица измерения'>
                    <PlatformFormVariants
                        options={_units}
                        value={formData.unit}
                        onChange={handleUnitChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title={formData.type === 'service' ? 'Цена оказания услуги (₽)' : 'Цена продажи (₽)'}>
                    <PlatformFormInput
                        placeholder="0.00"
                        value={formData.sale_price}
                        onChange={handleSalePriceChange}
                        type="text"
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                {formData.inventory_type === 'tracked' && (
                    <PlatformFormSection title='Цена закупки (₽)'>
                        <PlatformFormInput
                            placeholder="0.00"
                            value={formData.purchase_price}
                            onChange={handlePurchasePriceChange}
                            type="text"
                            disabled={isLoading}
                        />
                    </PlatformFormSection>
                )}

                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder="Дополнительная информация"
                        value={formData.comment}
                        onChange={handleCommentChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid() || isLoading}
                    >
                        {isLoading ? 'Создание...' : 'Создать позицию'}
                    </Button>
                </section>
            </PlatformFormBody>

            {/* выбор категории */}
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