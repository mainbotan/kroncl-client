'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import { useState, useEffect, useMemo } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useWm } from '@/apps/company/modules';
import { useRouter, useParams } from 'next/navigation';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { ChooseCategoryModal } from "../../../../components/choose-category-modal/modal";
import { CatalogCategory, UnitType, InventoryType, TrackedType, TrackingDetail } from '@/apps/company/modules/wm/types';
import styles from './page.module.scss';
import { CategoryCard } from "../../../../components/category-card/card";
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { _units } from "../../new/_units";
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";

export default function EditUnitPage() {
    const params = useParams();
    const companyId = params.id as string;
    const unitId = params.unitId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.WM_CATALOG_UNITS_UPDATE)
        
    const wmModule = useWm();
    const { showMessage } = useMessage();
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isFetchingCategory, setIsFetchingCategory] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalChooseCategoryOpen, setIsModalChooseCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CatalogCategory | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        comment: '',
        type: 'product' as UnitType,
        inventory_type: 'tracked' as InventoryType,
        tracking_detail: 'batch' as TrackingDetail | undefined,
        tracked_type: 'fifo' as TrackedType | undefined,
        unit: '',
        sale_price: '',
        purchase_price: '',
        currency: 'RUB' as const
    });

    // Фильтруем единицы измерения
    const unitOptions = useMemo(() => {
        if (formData.tracking_detail === 'serial') {
            return _units.filter(unit => unit.value === 'pcs');
        }
        return _units;
    }, [formData.tracking_detail]);

    // Автоматически ставим 'pcs' для serial
    useEffect(() => {
        if (formData.tracking_detail === 'serial' && formData.unit !== 'pcs') {
            setFormData(prev => ({ ...prev, unit: 'pcs' }));
        }
    }, [formData.tracking_detail]);

    // Загружаем данные позиции
    useEffect(() => {
        loadUnit();
    }, [unitId]);

    const loadUnit = async () => {
        setIsFetching(true);
        setError(null);
        try {
            const response = await wmModule.getUnit(unitId);
            
            if (response.status) {
                const unit = response.data;
                setFormData({
                    name: unit.name,
                    comment: unit.comment || '',
                    type: unit.type,
                    inventory_type: unit.inventory_type,
                    tracking_detail: unit.tracking_detail || undefined,
                    tracked_type: unit.tracked_type || undefined,
                    unit: unit.unit,
                    sale_price: unit.sale_price.toString(),
                    purchase_price: unit.purchase_price?.toString() || '',
                    currency: unit.currency
                });

                // Загружаем категорию
                if (unit.category_id) {
                    await loadCategory(unit.category_id);
                }
            } else {
                throw new Error(response.message || 'Ошибка загрузки позиции');
            }
        } catch (err: any) {
            setError(err.message || 'Не удалось загрузить позицию');
            showMessage({
                label: err.message || 'Не удалось загрузить позицию',
                variant: 'error'
            });
        } finally {
            setIsFetching(false);
        }
    };

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
            // Для услуги убираем purchase_price и tracking_detail
            purchase_price: newType === 'service' ? '' : prev.purchase_price,
            tracking_detail: newType === 'service' ? undefined : prev.tracking_detail
        }));
    };

    const handleInventoryTypeChange = (value: string) => {
        const newInventoryType = value as InventoryType;
        setFormData(prev => ({ 
            ...prev, 
            inventory_type: newInventoryType,
            // Если выбрали untracked, убираем tracked_type, purchase_price и tracking_detail
            ...(newInventoryType === 'untracked' ? { 
                tracked_type: undefined,
                purchase_price: '',
                tracking_detail: undefined
            } : {
                // Если tracked, ставим tracking_detail по умолчанию И tracked_type для batch
                tracking_detail: 'batch',
                tracked_type: 'fifo'
            })
        }));
    };

    const handleTrackingDetailChange = (value: string) => {
        const newTrackingDetail = value as TrackingDetail;
        setFormData(prev => ({ 
            ...prev, 
            tracking_detail: newTrackingDetail,
            // Если выбрали serial, убираем tracked_type и ставим unit='pcs'
            ...(newTrackingDetail === 'serial' ? { 
                tracked_type: undefined,
                unit: 'pcs'
            } : {
                // Если batch, ставим tracked_type по умолчанию
                tracked_type: 'fifo'
            })
        }));
    };

    const handleTrackedTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, tracked_type: value as TrackedType }));
    };

    const handleUnitChange = (value: string) => {
        setFormData(prev => ({ ...prev, unit: value }));
    };

    const handleSalePriceChange = (value: string) => {
        const cleaned = value.replace(/[^\d.]/g, '');
        setFormData(prev => ({ ...prev, sale_price: cleaned }));
    };

    const handlePurchasePriceChange = (value: string) => {
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

        // Для tracked товаров проверяем все поля
        if (formData.inventory_type === 'tracked') {
            if (!formData.tracking_detail) {
                showMessage({ label: 'Укажите детализацию учета (batch/serial)', variant: 'error' });
                return;
            }

            const purchasePrice = parseFloat(formData.purchase_price);
            if (isNaN(purchasePrice) || purchasePrice < 0) {
                showMessage({ label: 'Укажите корректную закупочную цену', variant: 'error' });
                return;
            }

            // Для batch-учета проверяем tracked_type
            if (formData.tracking_detail === 'batch' && !formData.tracked_type) {
                showMessage({ label: 'Укажите метод учета (FIFO/LIFO)', variant: 'error' });
                return;
            }

            // Для serial-учета проверяем что tracked_type не указан
            if (formData.tracking_detail === 'serial' && formData.tracked_type) {
                showMessage({ label: 'Для поштучного учета метод списания не применяется', variant: 'error' });
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
                name: formData.name.trim() || undefined,
                comment: formData.comment.trim() || null,
                type: formData.type,
                inventory_type: formData.inventory_type,
                unit: formData.unit.trim(),
                sale_price: parseFloat(formData.sale_price),
                currency: 'RUB',
                category_id: selectedCategory.id
            };

            // Добавляем поля для tracked товаров
            if (formData.inventory_type === 'tracked') {
                request.tracking_detail = formData.tracking_detail;
                request.purchase_price = parseFloat(formData.purchase_price);
                
                if (formData.tracking_detail === 'batch') {
                    request.tracked_type = formData.tracked_type;
                } else {
                    request.tracked_type = null;
                }
            } else {
                // Для untracked убираем все поля учета
                request.tracking_detail = null;
                request.tracked_type = null;
                request.purchase_price = null;
            }

            const response = await wmModule.updateUnit(unitId, request);

            if (response.status) {
                showMessage({
                    label: 'Товарная позиция успешно обновлена',
                    variant: 'success'
                });
                router.back();
            } else {
                throw new Error(response.message || 'Ошибка обновления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить позицию',
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
            if (!formData.tracking_detail) return false;
            
            const purchasePrice = parseFloat(formData.purchase_price);
            if (isNaN(purchasePrice) || purchasePrice < 0) return false;
            
            if (formData.tracking_detail === 'batch' && !formData.tracked_type) return false;
        }
        
        if (formData.type === 'service' && formData.inventory_type !== 'untracked') return false;
        
        return true;
    };

    if (isFetching || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (error) return (
        <PlatformError error={error} />
    )

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.WM_CATALOG_UNITS_UPDATE} />
    )

    return (
        <>
            <PlatformHead
                title='Редактирование позиции'
                description="Изменение параметров товарной позиции."
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
                                description: 'Отслеживание остатков на складе',
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
                    <>
                        <PlatformFormSection title='Детализация учета'>
                            <PlatformFormVariants
                                options={[
                                    { 
                                        value: 'batch', 
                                        label: 'Партионный учет',
                                        description: 'Учет по партиям с FIFO/LIFO. Подходит для массовых товаров.'
                                    },
                                    { 
                                        value: 'serial', 
                                        label: 'Поштучный учет',
                                        description: 'Каждый экземпляр учитывается отдельно. Для уникальных товаров.'
                                    }
                                ]}
                                value={formData.tracking_detail || 'batch'}
                                onChange={handleTrackingDetailChange}
                                disabled={isLoading}
                            />
                        </PlatformFormSection>

                        {formData.tracking_detail === 'batch' && (
                            <PlatformFormSection title='Метод учета партий'>
                                <PlatformFormVariants
                                    options={[
                                        { 
                                            value: 'fifo', 
                                            label: 'FIFO',
                                            description: 'Первым пришел — первым ушел (First In, First Out).'
                                        },
                                        { 
                                            value: 'lifo', 
                                            label: 'LIFO',
                                            description: 'Последним пришел — первым ушел (Last In, First Out).'
                                        }
                                    ]}
                                    value={formData.tracked_type || 'fifo'}
                                    onChange={handleTrackedTypeChange}
                                    disabled={isLoading}
                                />
                            </PlatformFormSection>
                        )}
                    </>
                )}

                <PlatformFormSection title='Единица измерения'>
                    <PlatformFormVariants
                        options={unitOptions}
                        value={formData.unit}
                        onChange={handleUnitChange}
                        disabled={isLoading || (formData.tracking_detail === 'serial' && formData.unit === 'pcs')}
                    />
                    {formData.tracking_detail === 'serial' && (
                        <div style={{  
                            color: 'var(--color-text-hint)', 
                            marginTop: '0.2em' 
                        }}>
                            Для поштучного учета доступна только единица "Штука (pcs)"
                        </div>
                    )}
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
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
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