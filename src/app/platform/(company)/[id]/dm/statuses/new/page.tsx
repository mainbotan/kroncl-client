'use client';

import styles from './page.module.scss';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { PlatformNotAllowed } from '@/app/platform/components/lib/not-allowed/block';

type NameStatus = 'idle' | 'valid' | 'invalid';

// Опции для выбора дефолтного статуса с описаниями
const DEFAULT_OPTIONS = [
    { 
        value: 'false', 
        label: 'Обычный статус',
        description: 'Обычный статус для сделок. Не влияет на новые сделки.'
    },
    { 
        value: 'true', 
        label: 'По умолчанию',
        description: 'Новые сделки будут автоматически получать этот статус.'
    }
];

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;

    // perms
    const ALLOW_PAGE = usePermission(PERMISSIONS.DM_STATUSES_CREATE)
    
    const dmModule = useDm();
    const router = useRouter();
    const { showMessage } = useMessage();
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        color: '#2563eb',
        comment: '',
        is_default: 'false' // string для PlatformFormVariants
    });

    const [nameStatus, setNameStatus] = useState<NameStatus>('idle');
    const [nameMessage, setNameMessage] = useState('');

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

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
        const validation = validateName(value);
        setNameStatus(validation.status);
        setNameMessage(validation.message);
    };

    const handleColorChange = (value: string) => {
        setFormData(prev => ({ ...prev, color: value }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleDefaultChange = (value: string) => {
        setFormData(prev => ({ ...prev, is_default: value }));
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
            const statusesResponse = await dmModule.getDealStatuses({ limit: 100 });
            
            // Проверяем что statuses существует и это массив
            const statusesData = statusesResponse.data?.statuses;
            const maxSortOrder = Array.isArray(statusesData) && statusesData.length > 0
                ? Math.max(...statusesData.map(s => s.sort_order)) + 1
                : 1;

            // Конвертируем is_default из string в boolean
            const isDefault = formData.is_default === 'true';

            const response = await dmModule.createDealStatus({
                name: formData.name.trim(),
                color: formData.color,
                comment: formData.comment.trim() || null,
                sort_order: maxSortOrder,
                is_default: isDefault // передаем флаг
            });

            if (response.status) {
                showMessage({
                    label: 'Статус успешно создан',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/dm/statuses`);
            } else {
                throw new Error(response.message || 'Ошибка создания статуса');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать статус',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (ALLOW_PAGE.isLoading) return (
        <PlatformLoading />
    )

    if (!isAllowed(ALLOW_PAGE)) return (
        <PlatformNotAllowed permission={PERMISSIONS.DM_STATUSES_CREATE} />
    )

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

    const isFormValid = nameStatus === 'valid';
    const nameStatusInfo = getNameStatusInfo();

    return (
        <>
            <PlatformHead
                title='Новый статус'
                description='Создание нового статуса сделки'
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название'>
                    <PlatformFormInput
                        placeholder='В работе'
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

                <PlatformFormSection title='Цвет'>
                    <PlatformFormInput
                        type="color"
                        value={formData.color}
                        onChange={handleColorChange}
                        disabled={isLoading}
                        className={styles.colorInput}
                    />
                </PlatformFormSection>

                {/* Выбор дефолтного статуса через Variants */}
                <PlatformFormSection title='Тип статуса'>
                    <PlatformFormVariants
                        options={DEFAULT_OPTIONS}
                        value={formData.is_default}
                        onChange={handleDefaultChange}
                        disabled={isLoading}
                    />
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
                        {isLoading ? 'Создание...' : 'Создать статус'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}