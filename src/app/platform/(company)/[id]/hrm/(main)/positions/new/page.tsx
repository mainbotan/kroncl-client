'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useHrm } from '@/apps/company/modules';
import { useRouter, useParams } from 'next/navigation';
import { usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const hrmModule = useHrm();
    const { showMessage } = useMessage();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const ALLOW_PAGE = usePermission(PERMISSIONS.HRM_POSITIONS_CREATE);
        
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    
    const [validation, setValidation] = useState({
        name: { isValid: false, message: '' }
    });

    const validateName = (value: string) => {
        const trimmed = value.trim();
        return {
            isValid: trimmed.length >= 2,
            message: trimmed.length >= 2 ? 'Корректное название' : 'Название должно быть не менее 2 символов'
        };
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
        setValidation(prev => ({ ...prev, name: validateName(value) }));
    };

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleSubmit = async () => {
        if (!validation.name.isValid || isLoading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await hrmModule.createPosition({
                name: formData.name.trim(),
                description: formData.description.trim() || null
            });

            if (response.status && response.data) {
                showMessage({
                    label: 'Должность успешно создана',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/hrm/positions/${response.data.id}`);
            } else {
                throw new Error(response.message || 'Ошибка создания должности');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать должность',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = validation.name.isValid;

    if (!ALLOW_PAGE.isLoading && !ALLOW_PAGE.allowed) return (
        <PlatformNotAllowed permission={PERMISSIONS.HRM_POSITIONS_CREATE} />
    )
    
    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );

    return (
        <>
            <PlatformHead
                title='Новая должность'
                description="Создание новой должности в организации."
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название должности'>
                    <PlatformFormInput
                        placeholder="Например: Менеджер по продажам"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={isLoading}
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
                        placeholder="Краткое описание должности"
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>
                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Создание...' : 'Создать должность'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}