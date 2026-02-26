'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useState, useEffect } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useCrm } from '@/apps/company/modules';
import { useParams, useRouter } from 'next/navigation';
import { SourceType, ClientSource } from "@/apps/company/modules/crm/types";
import { sourceTypes } from "../../new/_types";
import Spinner from '@/assets/ui-kit/spinner/spinner';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const sourceId = params.sourceId as string;
    const crmModule = useCrm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [source, setSource] = useState<ClientSource | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        comment: '',
        type: 'social' as SourceType
    });
    
    const [validation, setValidation] = useState({
        name: { isValid: false, message: '' }
    });

    useEffect(() => {
        loadSource();
    }, [sourceId]);

    const loadSource = async () => {
        setInitialLoading(true);
        try {
            const response = await crmModule.getSource(sourceId);
            if (response.status && response.data) {
                setSource(response.data);
                setFormData({
                    name: response.data.name || '',
                    url: response.data.url || '',
                    comment: response.data.comment || '',
                    type: response.data.type
                });
                setValidation({
                    name: validateName(response.data.name || '')
                });
            } else {
                showMessage({
                    label: 'Источник не найден',
                    variant: 'error'
                });
                router.push(`/platform/${companyId}/crm/sources`);
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Ошибка загрузки источника',
                variant: 'error'
            });
            router.push(`/platform/${companyId}/crm/sources`);
        } finally {
            setInitialLoading(false);
        }
    };

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
            const updateData = {
                name: formData.name.trim() !== source?.name ? formData.name.trim() : undefined,
                type: formData.type !== source?.type ? formData.type : undefined,
                url: formData.url.trim() !== source?.url ? (formData.url.trim() || null) : undefined,
                comment: formData.comment.trim() !== source?.comment ? (formData.comment.trim() || '') : undefined
            };

            // Убираем undefined поля
            Object.keys(updateData).forEach(key => 
                updateData[key as keyof typeof updateData] === undefined && 
                delete updateData[key as keyof typeof updateData]
            );

            // Если ничего не изменилось
            if (Object.keys(updateData).length === 0) {
                showMessage({
                    label: 'Нет изменений для сохранения',
                    variant: 'success'
                });
                setLoading(false);
                return;
            }

            const response = await crmModule.updateSource(sourceId, updateData);

            if (response.status) {
                showMessage({
                    label: 'Источник успешно обновлён',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/crm/sources/${sourceId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления источника');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить источник',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
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

    const isFormValid = validation.name.isValid;
    const hasChanges = formData.name !== source?.name ||
                      formData.type !== source?.type ||
                      formData.url !== source?.url ||
                      formData.comment !== source?.comment;

    return (
        <>
            <PlatformHead
                title='Редактирование источника'
                description='Изменение параметров источника трафика.'
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
                        disabled={!isFormValid || !hasChanges || loading}
                    >
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}