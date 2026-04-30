'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useEffect, useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useHrm } from '@/apps/company/modules';
import { useParams, useRouter } from 'next/navigation';
import { Position } from "@/apps/company/modules/hrm/types";
import { isAllowed, usePermission } from "@/apps/permissions/hooks";
import { PERMISSIONS } from "@/apps/permissions/codes.config";
import { PlatformLoading } from "@/app/platform/components/lib/loading/loading";
import { PlatformError } from "@/app/platform/components/lib/error/block";
import { PlatformNotAllowed } from "@/app/platform/components/lib/not-allowed/block";
import { DOCS_LINK_HRM_POSITIONS } from "@/app/docs/(v1)/internal.config";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const positionId = params.positionId as string;

    const ALLOW_PAGE = usePermission(PERMISSIONS.HRM_POSITIONS_UPDATE);

    const hrmModule = useHrm();
    const router = useRouter();

    const [position, setPosition] = useState<Position | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showMessage } = useMessage();

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!positionId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await hrmModule.getPosition(positionId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setPosition(response.data);
                } else {
                    setError("Не удалось загрузить данные должности");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading position ${positionId}:`, err);
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
    }, [positionId]);
    
    useEffect(() => {
        if (position) {
            setFormData({
                name: position.name || '',
                description: position.description || ''
            });
            
            setValidation({
                name: validateName(position.name || '')
            });
        }
    }, [position]);

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

            updateData.description = formData.description.trim() || null;

            const response = await hrmModule.updatePosition(position!.id, updateData);

            if (response.status) {
                showMessage({
                    label: 'Должность успешно обновлена',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/hrm/positions/${positionId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления должности');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить должность',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = validation.name.isValid;

    if (!isAllowed(ALLOW_PAGE)) return (
        <PlatformNotAllowed permission={PERMISSIONS.HRM_POSITIONS_UPDATE} />
    )

    if (loading || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    );
    
    if (error) return (
        <PlatformError error={error} />
    );

    if (!position) return (
        <PlatformError error='Не удалось загрузить должность' />
    );

    return (
        <>
            <PlatformHead
                title='Редактирование должности'
                description={`ID: ${position.id}`}
                docsEscort={{
                    href: DOCS_LINK_HRM_POSITIONS,
                    title: 'Подробнее о должностях'
                }}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название должности'>
                    <PlatformFormInput
                        placeholder="Например: Менеджер по продажам"
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={loading}
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
                        disabled={loading}
                    />
                </PlatformFormSection>
                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? 'Обновление...' : 'Обновить должность'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}