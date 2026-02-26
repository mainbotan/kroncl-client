'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useCrm } from '@/apps/company/modules';
import { useParams, useRouter } from 'next/navigation';
import { SourceType } from "@/apps/company/modules/crm/types";
import { sourceTypes } from "./_types";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const crmModule = useCrm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        comment: '',
        type: 'social' as SourceType,
        system: false
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

    const handleUrlChange = (value: string) => {
        setFormData(prev => ({ ...prev, url: value }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ 
            ...prev, 
            type: value as SourceType 
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
                type: formData.type,
                url: formData.url.trim() || null,
                comment: formData.comment.trim() || null,
                system: false // обычные пользовательские источники
            };

            const response = await crmModule.createSource(createData);

            if (response.status) {
                showMessage({
                    label: 'Источник успешно создан',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/crm/sources/${response.data.id}`);
            } else {
                throw new Error(response.message || 'Ошибка создания источника');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать источник',
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
                title='Новый источник'
                description='Создание источника для отслеживания каналов привлечения клиентов.'
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название источника'>
                    <PlatformFormInput
                        placeholder="Например: Авито, Яндекс.Директ, Instagram"
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

                <PlatformFormSection title='URL (опционально)'>
                    <PlatformFormInput
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={handleUrlChange}
                        disabled={loading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder="Дополнительная информация об источнике"
                        value={formData.comment}
                        onChange={handleCommentChange}
                        disabled={loading}
                    />
                </PlatformFormSection>

                <PlatformFormSection
                    title="Тип источника"
                    description="Выберите категорию источника трафика."
                >
                    <PlatformFormVariants
                        options={sourceTypes}
                        value={formData.type}
                        onChange={handleTypeChange}
                        disabled={loading}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? 'Создание...' : 'Создать источник'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}