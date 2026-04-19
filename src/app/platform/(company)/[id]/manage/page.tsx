'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { DOCS_LINK_COMPANIES } from '@/app/docs/(v1)/internal.config';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormTextarea, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { useParams } from 'next/navigation';
import { isAllowed, usePermission } from '@/apps/permissions/hooks';
import { PERMISSIONS } from '@/apps/permissions/codes.config';
import { PlatformLoading } from '@/app/platform/components/lib/loading/loading';
import { useCompany } from '@/apps/company/provider';
import { useEffect, useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useManage } from '@/apps/company/modules';
import { PlatformDangerZone } from '@/app/platform/components/lib/danger-zone/block';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';

const REGIONS = [
    { value: 'ru-RU', label: 'Россия (₽)' },
    { value: 'kz-KZ', label: 'Казахстан (₸)' },
];

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const { company, setCompany } = useCompany();
    const { showMessage } = useMessage();
    const manageModule = useManage();

    const ALLOW_UPDATE = usePermission(PERMISSIONS.COMPANY_UPDATE);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        email: '',
        site: '',
        region: 'ru-RU',
    });
    const [isPublic, setIsPublic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
    const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name || '',
                description: company.description || '',
                email: company.email || '',
                site: company.site || '',
                region: company.region || 'ru-RU',
            });
            setIsPublic(company.is_public || false);
        }
    }, [company]);

    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSubmit = async () => {
        if (!company) return;

        setIsLoading(true);
        try {
            const updateData: any = {
                name: formData.name.trim(),
                description: formData.description.trim() || null,
                region: formData.region,
            };

            if (formData.email.trim()) {
                updateData.email = formData.email.trim();
            }
            if (formData.site.trim()) {
                updateData.site = formData.site.trim();
            }

            const response = await manageModule.updateCompany(companyId, updateData);

            if (response.status) {
                if (response.data) {
                    setCompany(response.data);
                }
                setHasChanges(false);
                showMessage({
                    label: 'Данные компании обновлены',
                    variant: 'success'
                });
            } else {
                throw new Error(response.message || 'Ошибка обновления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить данные',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePublic = async () => {
        if (!company) return;

        setIsUpdatingPublic(true);
        try {
            const response = await manageModule.updateCompany(companyId, {
                is_public: !isPublic,
            });

            if (response.status) {
                if (response.data) {
                    setCompany(response.data);
                }
                setIsPublic(!isPublic);
                showMessage({
                    label: isPublic ? 'Компания стала приватной' : 'Компания стала публичной',
                    variant: 'success'
                });
                setIsPublicModalOpen(false);
            } else {
                throw new Error(response.message || 'Ошибка обновления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось изменить статус видимости',
                variant: 'error'
            });
        } finally {
            setIsUpdatingPublic(false);
        }
    };

    if (ALLOW_UPDATE.isLoading) return <PlatformLoading />;

    const canEdit = isAllowed(ALLOW_UPDATE);
    
    return (
        <>
            <PlatformHead
                title='Управление компанией'
                description='Возможности управления предприятием. Изменение данных, удаление компании.'
                actions={canEdit ? [
                    {
                        variant: 'accent',
                        children: isLoading ? 'Сохранение...' : 'Сохранить',
                        onClick: handleSubmit,
                        disabled: !hasChanges || isLoading
                    }
                ] : undefined}
                docsEscort={{
                    href: DOCS_LINK_COMPANIES,
                    title: 'Подробнее об управлении организацией'
                }}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название компании'>
                    <PlatformFormInput
                        value={formData.name}
                        onChange={(v) => handleFieldChange('name', v)}
                        placeholder='Название компании'
                        disabled={isLoading || !canEdit}
                    />
                </PlatformFormSection>
                <PlatformFormSection title='Описание компании'>
                    <PlatformFormTextarea
                        value={formData.description}
                        onChange={(v) => handleFieldChange('description', v)}
                        placeholder='Описание компании'
                        disabled={isLoading || !canEdit}
                    />
                </PlatformFormSection>
                <PlatformFormSection title='Email для связи'>
                    <PlatformFormInput
                        value={formData.email}
                        onChange={(v) => handleFieldChange('email', v)}
                        placeholder='company@example.com'
                        type='email'
                        disabled={isLoading || !canEdit}
                    />
                </PlatformFormSection>
                <PlatformFormSection title='Сайт'>
                    <PlatformFormInput
                        value={formData.site}
                        onChange={(v) => handleFieldChange('site', v)}
                        placeholder='https://example.com'
                        disabled={isLoading || !canEdit}
                    />
                </PlatformFormSection>
                <PlatformFormSection title='Регион' description='Определяет валюту и региональные настройки'>
                    <PlatformFormVariants
                        value={formData.region}
                        onChange={(v) => handleFieldChange('region', v)}
                        options={REGIONS}
                        disabled={isLoading || !canEdit}
                    />
                </PlatformFormSection>
                <PlatformFormSection 
                    actions={[
                        {
                            variant: 'accent',
                            children: 'Скопировать',
                            onClick: () => {
                                navigator.clipboard.writeText(companyId);
                                showMessage({
                                    label: 'ID скопирован',
                                    variant: 'success'
                                });
                            }
                        }
                    ]}
                    title='Идентификатор компании' 
                    description='ID компании - статичное значение, не изменяющееся при обновлении имени или другой информации.'
                >
                    <PlatformFormInput
                        value={companyId}
                        readOnly
                    />
                </PlatformFormSection>
            </PlatformFormBody>
            
            {canEdit && (
                <PlatformDangerZone
                    className={styles.dangerZone}
                    description='Данные действия влияют на состояние организации.'
                    items={[
                        {
                            title: 'Сменить статус видимости',
                            description: isPublic 
                                ? 'Сделать компанию приватной (доступ только по приглашениям)' 
                                : 'Сделать компанию публичной (видна в поиске)',
                            actions: [
                                {
                                    variant: 'red',
                                    children: isPublic ? 'Сделать приватной' : 'Сделать публичной',
                                    onClick: () => setIsPublicModalOpen(true),
                                }
                            ]
                        }
                    ]}
                />
            )}

            <PlatformModal
                isOpen={isPublicModalOpen}
                onClose={() => setIsPublicModalOpen(false)}
            >
                <PlatformModalConfirmation
                    title={isPublic ? 'Сделать компанию приватной?' : 'Сделать компанию публичной?'}
                    description={isPublic 
                        ? 'Компания перестанет отображаться в публичном поиске. Доступ будет только по приглашениям.'
                        : 'Компания станет видна всем пользователям в публичном поиске. Информация о компании (название, описание, сайт) будет общедоступна.'}
                    actions={[
                        {
                            children: 'Отмена',
                            variant: 'light',
                            onClick: () => setIsPublicModalOpen(false),
                            disabled: isUpdatingPublic
                        },
                        {
                            variant: 'red',
                            onClick: handleTogglePublic,
                            children: isUpdatingPublic ? 'Обновление...' : (isPublic ? 'Сделать приватной' : 'Сделать публичной'),
                            disabled: isUpdatingPublic
                        }
                    ]}
                />
            </PlatformModal>
        </>
    )
}