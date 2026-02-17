'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { useFm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { Counterparty, CounterpartyType, CounterpartyStatus } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';

type FieldStatus = 'idle' | 'valid' | 'invalid';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const counterpartyId = params.counterpartyId as string;
    const fmModule = useFm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        comment: '',
        type: 'organization' as CounterpartyType
    });

    const [validation, setValidation] = useState({
        name: { isValid: false, message: '' }
    });

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!counterpartyId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await fmModule.getCounterparty(counterpartyId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setCounterparty(response.data);
                    setFormData({
                        name: response.data.name || '',
                        comment: response.data.comment || '',
                        type: response.data.type
                    });
                    setValidation({
                        name: validateName(response.data.name || '')
                    });
                } else {
                    setError("Не удалось загрузить данные контрагента");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading counterparty ${counterpartyId}:`, err);
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
    }, [counterpartyId]);

    const validateName = (value: string): { isValid: boolean; message: string } => {
        const trimmed = value.trim();
        if (!trimmed) {
            return { isValid: false, message: 'Название обязательно' };
        }
        if (trimmed.length < 2) {
            return { isValid: false, message: 'Минимум 2 символа' };
        }
        if (trimmed.length > 255) {
            return { isValid: false, message: 'Максимум 255 символов' };
        }
        return { isValid: true, message: 'Корректное название' };
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
        setValidation(prev => ({ ...prev, name: validateName(value) }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value as CounterpartyType }));
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
            const updateData: any = {
                name: formData.name.trim()
            };

            if (formData.comment !== counterparty?.comment) {
                updateData.comment = formData.comment.trim() || '';
            }

            if (formData.type !== counterparty?.type) {
                updateData.type = formData.type;
            }

            const response = await fmModule.updateCounterparty(counterparty!.id, updateData);

            if (response.status) {
                showMessage({
                    label: 'Контрагент успешно обновлён',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/fm/credits/counterparties/${counterpartyId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления контрагента');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить контрагента',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusInfo = () => {
        if (validation.name.isValid) {
            return {
                type: 'success' as const,
                icon: <SuccessStatus />,
                message: validation.name.message
            };
        }
        if (validation.name.message) {
            return {
                type: 'error' as const,
                icon: <ErrorStatus />,
                message: validation.name.message
            };
        }
        return {
            type: 'info' as const,
            icon: null,
            message: ''
        };
    };

    const isFormValid = validation.name.isValid;
    const statusInfo = getStatusInfo();

    if (loading) return (
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
    
    if (error) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            {error}
        </div>
    );

    if (!counterparty) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            Контрагент не найден
        </div>
    );

    return (
        <>
            <PlatformHead
                title='Редактирование контрагента'
                description={`${counterparty.name}`}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название контрагента'>
                    <PlatformFormInput
                        placeholder='Например: Т-Банк, ООО "Ромашка", Иванов И.И.'
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={isLoading}
                        maxLength={255}
                    />
                    {validation.name.message && (
                        <PlatformFormStatus
                            type={statusInfo.type}
                            message={statusInfo.message}
                            icon={statusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder='Дополнительная информация о контрагенте'
                        value={formData.comment}
                        onChange={handleCommentChange}
                        disabled={isLoading}
                        maxLength={1000}
                    />
                </PlatformFormSection>

                <PlatformFormSection
                    title="Тип контрагента"
                    description="Банк, организация или физическое лицо"
                >
                    <PlatformFormVariants
                        options={[
                            {
                                value: 'bank',
                                label: 'Банк',
                                description: 'Кредитная организация',
                                // icon: <Bank />
                            },
                            {
                                value: 'organization',
                                label: 'Организация',
                                description: 'Юридическое лицо',
                                // icon: <Organization />
                            },
                            {
                                value: 'person',
                                label: 'Физлицо',
                                description: 'Индивидуальный предприниматель или частное лицо',
                                // icon: <Person />
                            }
                        ]}
                        value={formData.type}
                        onChange={handleTypeChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <section>
                    <Button
                        variant='accent'
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}