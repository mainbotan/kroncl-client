'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useFm } from '@/apps/company/modules';
import { useParams, useRouter } from 'next/navigation';
import { TransactionCategoryDirection } from "@/apps/company/modules/fm/types";
import { categoryDirections } from "./_directions";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const fmModule = useFm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [loading, setLoading] = useState(false);
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
            const createData = {
                name: formData.name.trim(),
                description: formData.description.trim() || "",
                direction: formData.direction,
                system: false // обычные пользовательские категории
            };

            const response = await fmModule.createCategory(createData);

            if (response.status) {
                showMessage({
                    label: 'Категория успешно создана',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/fm/categories/${response.data.id}`);
            } else {
                throw new Error(response.message || 'Ошибка создания категории');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать категорию',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = validation.name.isValid;

    return (
        <>
            <PlatformHead
                title='Новая категория'
                description='Создание категории для учёта доходов и расходов.'
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
                        {loading ? 'Создание...' : 'Создать категорию'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}