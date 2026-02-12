'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useEffect, useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useFm } from '@/apps/company/modules';
import { useParams, useRouter } from 'next/navigation';
import { TransactionCategory, TransactionCategoryDirection } from "@/apps/company/modules/fm/types";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { categoryDirections } from "../../new/_directions";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const categoryId = params.categoryId as string;
    const fmModule = useFm();
    const router = useRouter();

    const [category, setCategory] = useState<TransactionCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showMessage } = useMessage();

    // загрузка категории
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
    
    // установка начального состояния формы
    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                description: category.description || '',
                direction: category.direction
            });
            
            setValidation({
                name: validateName(category.name || '')
            });
        }
    }, [category]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        direction: 'expense' as TransactionCategoryDirection
    });
    
    const [validation, setValidation] = useState({
        name: { isValid: false, message: '' }
    });

    const validateName = (value: string) => {
        const trimmed = value.trim();
        return {
            isValid: trimmed.length >= 1 && trimmed.length <= 255,
            message: trimmed.length >= 1 
                ? (trimmed.length <= 255 ? 'Корректное название' : 'Максимум 255 символов')
                : 'Название обязательно'
        };
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
        setValidation(prev => ({ ...prev, name: validateName(value) }));
    };

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleDirectionChange = (value: string) => {
        setFormData(prev => ({ 
            ...prev, 
            direction: value as TransactionCategoryDirection 
        }));
    };

    const handleSubmit = async () => {
        if (!validation.name.isValid || loading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                name: formData.name.trim()
            };

            if (formData.description !== category?.description) {
                updateData.description = formData.description.trim() || "";
            }

            if (formData.direction !== category?.direction) {
                updateData.direction = formData.direction;
            }

            const response = await fmModule.updateCategory(category!.id, updateData);

            if (response.status) {
                showMessage({
                    label: 'Категория успешно обновлена',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/fm/categories/${categoryId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления категории');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить категорию',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = validation.name.isValid;

    if (loading) return (
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
    
    if (error) return (
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

    if (!category) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            Категория не найдена
        </div>
    );

    // запрещаем редактирование системных категорий
    if (category.system) {
        return (
            <div style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem",
                flexDirection: "column",
                gap: "1rem"
            }}>
                <div>Системные категории нельзя редактировать</div>
                <Button
                    variant="light"
                    onClick={() => router.push(`/platform/${companyId}/fm/categories/${categoryId}`)}
                >
                    Вернуться к категории
                </Button>
            </div>
        );
    }

    return (
        <>
            <PlatformHead
                title='Редактирование категории'
                description={`Категория «${category.name}».`}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название категории'>
                    <PlatformFormInput
                        placeholder="Например: Аренда, Зарплата, Продажи"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={loading}
                        maxLength={255}
                    />
                    {validation.name.message && (
                        <PlatformFormStatus
                            type={validation.name.isValid ? "success" : "error"}
                            message={validation.name.message}
                            icon={validation.name.isValid ? <SuccessStatus /> : <ErrorStatus />}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Описание (опционально)'>
                    <PlatformFormInput
                        placeholder="Краткое описание категории"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        disabled={loading}
                        maxLength={1000}
                    />
                </PlatformFormSection>

                <PlatformFormSection
                    title="Тип категории"
                    description="Доход — поступления средств, Расход — затраты организации."
                >
                    <PlatformFormVariants
                        options={categoryDirections}
                        value={formData.direction}
                        onChange={handleDirectionChange}
                        disabled={loading}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? 'Обновление...' : 'Сохранить изменения'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}