'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { motion } from 'framer-motion';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

type NameStatus = 'idle' | 'valid' | 'invalid';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const typeId = params.typeId as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_TYPES_UPDATE)

    const dmModule = useDm();
    const router = useRouter();
    const { showMessage } = useMessage();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        comment: ''
    });

    const [nameStatus, setNameStatus] = useState<NameStatus>('idle');
    const [nameMessage, setNameMessage] = useState('');

    // Функция валидации - определена до useEffect
    const validateName = (value: string): { status: NameStatus; message: string } => {
        const trimmed = value.trim();
        if (!trimmed) {
            return { status: 'invalid', message: 'Название обязательно' };
        }
        if (trimmed.length < 1) {
            return { status: 'invalid', message: 'Название должно содержать хотя бы 1 символ' };
        }
        if (trimmed.length > 255) {
            return { status: 'invalid', message: 'Название не может быть длиннее 255 символов' };
        }
        return { status: 'valid', message: 'Название корректно' };
    };

    // Загрузка данных
    useEffect(() => {
        let isMounted = true;
        
        const fetchType = async () => {
            try {
                const response = await dmModule.getDealType(typeId);
                
                if (!isMounted) return;
                
                if (response.status && response.data) {
                    const data = response.data;
                    setFormData({
                        name: data.name,
                        comment: data.comment || ''
                    });
                    
                    const validation = validateName(data.name);
                    setNameStatus(validation.status);
                    setNameMessage(validation.message);
                } else {
                    showMessage({
                        label: 'Не удалось загрузить данные типа',
                        variant: 'error'
                    });
                    router.push(`/platform/${companyId}/dm/types`);
                }
            } catch (error) {
                if (!isMounted) return;
                
                showMessage({
                    label: 'Ошибка загрузки типа',
                    variant: 'error'
                });
                router.push(`/platform/${companyId}/dm/types`);
            } finally {
                if (isMounted) {
                    setIsFetching(false);
                }
            }
        };

        fetchType();
        
        return () => {
            isMounted = false;
        };
    }, [typeId]); // Только typeId в зависимостях

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
        const validation = validateName(value);
        setNameStatus(validation.status);
        setNameMessage(validation.message);
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleSubmit = async () => {
        const nameValidation = validateName(formData.name);

        setNameStatus(nameValidation.status);
        setNameMessage(nameValidation.message);

        if (nameValidation.status !== 'valid' || isLoading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await dmModule.updateDealType(typeId, {
                name: formData.name.trim(),
                comment: formData.comment.trim() || ''
            });

            if (response.status) {
                showMessage({
                    label: 'Тип успешно обновлен',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/dm/types/${typeId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления типа');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить тип',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getNameStatusInfo = () => {
        switch (nameStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: nameMessage
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: nameMessage
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    if (isFetching || ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!isAllowed(ALLOW_PAGE)) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_TYPES_UPDATE} />
    )

    const isFormValid = nameStatus === 'valid';
    const nameStatusInfo = getNameStatusInfo();

    return (
        <>
            <PlatformHead
                title='Редактирование типа'
                description={`Редактирование типа "${formData.name}"`}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название'>
                    <PlatformFormInput
                        placeholder='Ремонт агрегата'
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={isLoading}
                        maxLength={255}
                    />
                    {nameStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={nameStatusInfo.type}
                            message={nameStatusInfo.message}
                            icon={nameStatusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder='Дополнительная информация...'
                        value={formData.comment}
                        onChange={handleCommentChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant='accent'
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}