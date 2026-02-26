'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { ClientType } from '@/apps/company/modules/crm/types';
import { useCrm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { ChooseSourceBlock } from './choose-source/block';
import { ClientSource } from '@/apps/company/modules/crm/types';

type NameStatus = 'idle' | 'valid' | 'invalid';
type SourceStatus = 'idle' | 'valid' | 'invalid';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const crmModule = useCrm();
    const router = useRouter();
    const { showMessage } = useMessage();
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        patronymic: '',
        phone: '',
        email: '',
        comment: '',
        type: 'individual' as ClientType,
        source: null as ClientSource | null
    });

    const [firstNameStatus, setFirstNameStatus] = useState<NameStatus>('idle');
    const [firstNameMessage, setFirstNameMessage] = useState('');
    const [sourceStatus, setSourceStatus] = useState<SourceStatus>('idle');
    const [sourceMessage, setSourceMessage] = useState('');

    const validateFirstName = (value: string): { status: NameStatus; message: string } => {
        const trimmed = value.trim();
        if (!trimmed) {
            return { status: 'invalid', message: 'Имя обязательно' };
        }
        if (trimmed.length < 1) {
            return { status: 'invalid', message: 'Имя должно содержать хотя бы 1 символ' };
        }
        if (trimmed.length > 100) {
            return { status: 'invalid', message: 'Имя не может быть длиннее 100 символов' };
        }
        return { status: 'valid', message: 'Имя корректно' };
    };

    const validateSource = (source: ClientSource | null): { status: SourceStatus; message: string } => {
        if (!source) {
            return { status: 'invalid', message: 'Выберите источник привлечения' };
        }
        if (source.status !== 'active') {
            return { status: 'invalid', message: 'Выбранный источник неактивен' };
        }
        return { status: 'valid', message: 'Источник выбран' };
    };

    const handleFirstNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, firstName: value }));
        
        const validation = validateFirstName(value);
        setFirstNameStatus(validation.status);
        setFirstNameMessage(validation.message);
    };

    const handleLastNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, lastName: value }));
    };

    const handlePatronymicChange = (value: string) => {
        setFormData(prev => ({ ...prev, patronymic: value }));
    };

    const handlePhoneChange = (value: string) => {
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const handleEmailChange = (value: string) => {
        setFormData(prev => ({ ...prev, email: value }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value as ClientType }));
    };

    const handleSourceSelect = (source: ClientSource) => {
        setFormData(prev => ({ ...prev, source }));
        setSourceStatus(validateSource(source).status);
        setSourceMessage('');
    };

    const handleSubmit = async () => {
        const sourceValidation = validateSource(formData.source);
        setSourceStatus(sourceValidation.status);
        setSourceMessage(sourceValidation.message);

        if (firstNameStatus !== 'valid' || sourceValidation.status !== 'valid' || isLoading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await crmModule.createClient({
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim() || null,
                patronymic: formData.patronymic.trim() || null,
                phone: formData.phone.trim() || null,
                email: formData.email.trim() || null,
                comment: formData.comment.trim() || null,
                type: formData.type,
                source_id: formData.source!.id
            });

            if (response.status) {
                showMessage({
                    label: 'Клиент успешно создан',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/crm/${response.data.id}`);
            } else {
                throw new Error(response.message || 'Ошибка создания клиента');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать клиента',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getFirstNameStatusInfo = () => {
        switch (firstNameStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: firstNameMessage
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: firstNameMessage
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    const getSourceStatusInfo = () => {
        switch (sourceStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: 'Источник выбран'
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: sourceMessage
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    const isFormValid = firstNameStatus === 'valid' && sourceStatus === 'valid';
    const firstNameStatusInfo = getFirstNameStatusInfo();
    const sourceStatusInfo = getSourceStatusInfo();

    return (
        <>
            <PlatformHead
                title='Новый клиент'
                description={formData.type === 'individual' ? 'Физическое лицо' : 'Юридическое лицо'}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Имя'>
                    <PlatformFormInput
                        placeholder='Иван'
                        value={formData.firstName}
                        onChange={handleFirstNameChange}
                        disabled={isLoading}
                        maxLength={100}
                    />
                    {firstNameStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={firstNameStatusInfo.type}
                            message={firstNameStatusInfo.message}
                            icon={firstNameStatusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Фамилия (опционально)'>
                    <PlatformFormInput
                        placeholder='Иванов'
                        value={formData.lastName}
                        onChange={handleLastNameChange}
                        disabled={isLoading}
                        maxLength={100}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Отчество (опционально)'>
                    <PlatformFormInput
                        placeholder='Иванович'
                        value={formData.patronymic}
                        onChange={handlePatronymicChange}
                        disabled={isLoading}
                        maxLength={100}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Тип клиента'>
                    <PlatformFormVariants
                        options={[
                            {
                                value: 'individual',
                                label: 'Физическое лицо',
                            },
                            {
                                value: 'legal',
                                label: 'Юридическое лицо',
                            }
                        ]}
                        value={formData.type}
                        onChange={handleTypeChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Телефон (опционально)'>
                    <PlatformFormInput
                        placeholder='+7 (999) 999-99-99'
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Email (опционально)'>
                    <PlatformFormInput
                        placeholder='client@example.com'
                        value={formData.email}
                        onChange={handleEmailChange}
                        disabled={isLoading}
                        type='email'
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Источник привлечения (обязательно)'>
                    <ChooseSourceBlock 
                        className={styles.sourceBlock}
                        onSelect={handleSourceSelect}
                        disabled={isLoading}
                    />
                    {sourceStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={sourceStatusInfo.type}
                            message={sourceStatusInfo.message}
                            icon={sourceStatusInfo.icon}
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
                        {isLoading ? 'Создание...' : 'Создать клиента'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}