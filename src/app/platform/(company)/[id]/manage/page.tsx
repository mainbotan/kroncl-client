'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { DOCS_LINK_COMPANIES } from '@/app/docs/(v1)/internal.config';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormTextarea, PlatformFormVariants } from '@/app/platform/components/lib/form';
import { useParams, useRouter } from 'next/navigation';
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
import Button from '@/assets/ui-kit/button/button';
import Spinner from '@/assets/ui-kit/spinner/spinner';

const REGIONS = [
    { value: 'ru-RU', label: 'Россия (₽)' },
    { value: 'kz-KZ', label: 'Казахстан (₸)' },
];

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id as string;
    const { company, setCompany } = useCompany();
    const { showMessage } = useMessage();
    const manageModule = useManage();

    const ALLOW_UPDATE = usePermission(PERMISSIONS.COMPANY_UPDATE);
    const ALLOW_DELETE = usePermission(PERMISSIONS.COMPANY_DELETE);

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmInput, setConfirmInput] = useState('');

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

    const handleDelete = async () => {
        const expectedPhrase = `delete-${company?.slug}`;
        if (confirmInput !== expectedPhrase) {
            showMessage({
                label: 'Неверная фраза подтверждения',
                variant: 'error'
            });
            return;
        }

        setIsDeleting(true);
        try {
            const response = await manageModule.deleteCompany(companyId);
            if (response.status) {
                showMessage({
                    label: 'Компания удалена',
                    variant: 'success'
                });
                setIsDeleteModalOpen(false);
                router.push('/platform');
            } else {
                throw new Error(response.message || 'Ошибка удаления');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось удалить компанию',
                variant: 'error'
            });
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setConfirmInput('');
        }
    };

    const expectedPhrase = `delete-${company?.slug}`;
    const isConfirmValid = confirmInput === expectedPhrase;

    if (ALLOW_UPDATE.isLoading || ALLOW_DELETE.isLoading) return <PlatformLoading />;

    const canEdit = isAllowed(ALLOW_UPDATE);
    const dangerZoneItems = [];

    if (canEdit) {
        dangerZoneItems.push({
            title: 'Сменить статус видимости',
            description: isPublic 
                ? 'Сделать компанию приватной (доступ только по приглашениям)' 
                : 'Сделать компанию публичной (видна в поиске)',
            actions: [
                {
                    variant: 'red' as const,
                    children: isPublic ? 'Сделать приватной' : 'Сделать публичной',
                    onClick: () => setIsPublicModalOpen(true),
                }
            ]
        });
    }

    if (isAllowed(ALLOW_DELETE)) {
        dangerZoneItems.push({
            title: 'Удалить компанию',
            description: 'Безвозвратное удаление пространства организации и всех данных.',
            actions: [
                {
                    variant: 'red' as const,
                    children: 'Удалить компанию',
                    onClick: () => {
                        setConfirmInput('');
                        setIsDeleteModalOpen(true);
                    },
                }
            ]
        });
    }
    
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
                                navigator.clipboard.writeText(company?.slug || '');
                                showMessage({
                                    label: 'Slug скопирован',
                                    variant: 'success'
                                });
                            }
                        }
                    ]}
                    title='Идентификатор компании' 
                    description='Статичное значение, не изменяющееся при обновлении имени или другой информации.'
                >
                    <PlatformFormInput
                        value={company?.slug || ''}
                        readOnly
                    />
                </PlatformFormSection>
            </PlatformFormBody>
            
            {dangerZoneItems.length > 0 && (
                <PlatformDangerZone
                    className={styles.dangerZone}
                    description='Данные действия влияют на состояние организации.'
                    items={dangerZoneItems}
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

            <PlatformModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                className={styles.deleteModal}
            >
                <div className={styles.deleteModalContainer}>
                    {isDeleting ? (
                        <div className={styles.resultWrap}>
                            <Spinner variant='accent' className={styles.spinner} />
                        </div>
                    ) : (
                        <>
                            <div className={styles.head}>
                                <div className={styles.title}>Удаление компании</div>
                                <div className={styles.description}>Безвозвратное удаление всех данных</div>
                            </div>
                            <div className={styles.warningWrap}>
                                <div className={styles.warning}>
                                    Удаление компании - необратимое действие, влекущее за собой полное разрушение данных
                                    всех модулей, настройки тарификации компании. В случае наличия остатка оплаты тарифа - средства не будут возвращены.
                                </div>
                            </div>
                            <div className={styles.formWrap}>
                                <PlatformFormBody className={styles.form}>
                                    <PlatformFormSection 
                                        title='Подтверждение удаления' 
                                        description={
                                            <>
                                                Введите ключевую фразу: <span className={styles.hint}>{expectedPhrase}</span>
                                            </>
                                        }>
                                        <PlatformFormInput
                                            value={confirmInput}
                                            onChange={setConfirmInput}
                                            placeholder={expectedPhrase}
                                            disabled={isDeleting}
                                        />
                                    </PlatformFormSection>
                                </PlatformFormBody>
                            </div>
                            <div className={styles.actions}>
                                <Button 
                                    children='Отменить'
                                    variant='light'
                                    onClick={handleCloseDeleteModal}
                                    className={styles.action}
                                    disabled={isDeleting}
                                />
                                <Button 
                                    children='Удалить'
                                    variant='red'
                                    className={styles.action}
                                    onClick={handleDelete}
                                    disabled={!isConfirmValid || isDeleting}
                                />
                            </div>
                        </>
                    )}
                </div>
            </PlatformModal>
        </>
    )
}