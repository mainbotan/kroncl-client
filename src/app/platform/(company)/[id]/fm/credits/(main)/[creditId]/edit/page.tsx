'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { CurrencyType, Counterparty, CreditDetail, UpdateCreditRequest } from '@/apps/company/modules/fm/types';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { ChooseCounterpartyModal } from '../../components/choose-countryparty-modal/modal';
import { CounterpartyCard } from '../../../counterparties/components/counterparty-card/card';
import { useFm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import Spinner from '@/assets/ui-kit/spinner/spinner';

type CreditType = 'debt' | 'credit';
type AmountStatus = 'idle' | 'valid' | 'invalid';
type CounterpartyStatus = 'idle' | 'valid' | 'invalid';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const creditId = params.creditId as string;
    const fmModule = useFm();
    const router = useRouter();
    const { showMessage } = useMessage();
    
    const [credit, setCredit] = useState<CreditDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        type: 'debt' as CreditType,
        total_amount: '',
        currency: 'RUB' as CurrencyType,
        interest_rate: '',
        start_date: '',
        end_date: '',
        comment: '',
        counterparty: null as Counterparty | null
    });

    const [amountStatus, setAmountStatus] = useState<AmountStatus>('idle');
    const [amountMessage, setAmountMessage] = useState('');
    const [interestStatus, setInterestStatus] = useState<AmountStatus>('idle');
    const [interestMessage, setInterestMessage] = useState('');
    const [counterpartyStatus, setCounterpartyStatus] = useState<CounterpartyStatus>('idle');
    const [isModalChooseCounterpartyOpen, setIsModalChooseCounterpartyOpen] = useState(false);

    // Загрузка кредита
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!creditId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await fmModule.getCredit(creditId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setCredit(response.data);
                    
                    // Форматируем даты для input type="date" (YYYY-MM-DD)
                    const formatDateForInput = (dateStr: string) => {
                        const date = new Date(dateStr);
                        return date.toISOString().split('T')[0];
                    };

                    setFormData({
                        name: response.data.name || '',
                        type: response.data.type,
                        total_amount: response.data.total_amount.toString(),
                        currency: response.data.currency,
                        interest_rate: response.data.interest_rate.toString(),
                        start_date: formatDateForInput(response.data.start_date),
                        end_date: formatDateForInput(response.data.end_date),
                        comment: response.data.comment || '',
                        counterparty: response.data.counterparty
                    });

                    setAmountStatus(validateAmount(response.data.total_amount.toString()).status);
                    setInterestStatus(validateInterest(response.data.interest_rate.toString()).status);
                    setCounterpartyStatus(validateCounterparty(response.data.counterparty).status);
                } else {
                    setError("Не удалось загрузить кредит");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading credit ${creditId}:`, err);
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
    }, [creditId]);

    const validateAmount = (value: string): { status: AmountStatus; message: string } => {
        const num = Number(value);
        if (!value) {
            return { status: 'idle', message: '' };
        }
        if (isNaN(num) || num <= 0) {
            return { status: 'invalid', message: 'Введите корректную сумму больше 0' };
        }
        return { status: 'valid', message: 'Сумма корректна' };
    };

    const validateInterest = (value: string): { status: AmountStatus; message: string } => {
        const num = Number(value);
        if (!value) {
            return { status: 'valid', message: 'Без процентов' };
        }
        if (isNaN(num) || num < 0 || num > 100) {
            return { status: 'invalid', message: 'Ставка должна быть от 0 до 100%' };
        }
        return { status: 'valid', message: 'Ставка корректна' };
    };

    const validateCounterparty = (counterparty: Counterparty | null): { status: CounterpartyStatus; message: string } => {
        if (!counterparty) {
            return { status: 'invalid', message: 'Выберите контрагента' };
        }
        return { status: 'valid', message: 'Контрагент выбран' };
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^\d.]/g, '');
        setFormData(prev => ({ ...prev, total_amount: cleaned }));
        
        const validation = validateAmount(cleaned);
        setAmountStatus(validation.status);
        setAmountMessage(validation.message);
    };

    const handleInterestChange = (value: string) => {
        const cleaned = value.replace(/[^\d.]/g, '');
        setFormData(prev => ({ ...prev, interest_rate: cleaned }));
        
        const validation = validateInterest(cleaned);
        setInterestStatus(validation.status);
        setInterestMessage(validation.message);
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({ ...prev, type: value as CreditType }));
    };

    const handleCurrencyChange = (value: string) => {
        setFormData(prev => ({ ...prev, currency: value as CurrencyType }));
    };

    const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleCounterpartySelect = (counterparty: Counterparty) => {
        setFormData(prev => ({ ...prev, counterparty }));
        setCounterpartyStatus(validateCounterparty(counterparty).status);
        setIsModalChooseCounterpartyOpen(false);
    };

    const handleSubmit = async () => {
        const counterpartyValidation = validateCounterparty(formData.counterparty);
        setCounterpartyStatus(counterpartyValidation.status);

        if (amountStatus !== 'valid' || interestStatus !== 'valid' || counterpartyValidation.status !== 'valid' || isLoading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        if (!formData.start_date || !formData.end_date) {
            showMessage({
                label: 'Укажите даты начала и окончания',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const updateData: UpdateCreditRequest = {};
            
            if (formData.name !== credit?.name) {
                updateData.name = formData.name || undefined;
            }
            
            if (formData.type !== credit?.type) {
                updateData.type = formData.type;
            }
            
            if (parseFloat(formData.total_amount) !== credit?.total_amount) {
                updateData.total_amount = parseFloat(formData.total_amount);
            }
            
            if (formData.currency !== credit?.currency) {
                updateData.currency = formData.currency;
            }
            
            if (parseFloat(formData.interest_rate) !== credit?.interest_rate) {
                updateData.interest_rate = parseFloat(formData.interest_rate) || 0;
            }
            
            const formattedStartDate = new Date(formData.start_date).toISOString();
            if (formattedStartDate !== credit?.start_date) {
                updateData.start_date = formattedStartDate;
            }
            
            const formattedEndDate = new Date(formData.end_date).toISOString();
            if (formattedEndDate !== credit?.end_date) {
                updateData.end_date = formattedEndDate;
            }
            
            if (formData.comment !== (credit?.comment || '')) {
                updateData.comment = formData.comment || '';
            }
            
            if (formData.counterparty?.id !== credit?.counterparty.id) {
                updateData.counterparty_id = formData.counterparty!.id;
            }

            const response = await fmModule.updateCredit(creditId, updateData);

            if (response.status) {
                showMessage({
                    label: 'Кредит успешно обновлён',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/fm/credits/${creditId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления кредита');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить кредит',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getAmountStatusInfo = () => {
        switch (amountStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: amountMessage
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: amountMessage
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    const getInterestStatusInfo = () => {
        switch (interestStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: interestMessage
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: interestMessage
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    const getCounterpartyStatusInfo = () => {
        switch (counterpartyStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: 'Контрагент выбран'
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: 'Выберите контрагента'
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    const isFormValid = amountStatus === 'valid' && interestStatus === 'valid' && counterpartyStatus === 'valid';
    const amountStatusInfo = getAmountStatusInfo();
    const interestStatusInfo = getInterestStatusInfo();
    const counterpartyStatusInfo = getCounterpartyStatusInfo();

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

    if (!credit) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            Кредит не найден
        </div>
    );

    return (
        <>
            <PlatformHead
                title={`Редактирование: ${credit.name}`}
                description='Изменение параметров кредита или займа'
            />
            <PlatformFormBody>
                <PlatformFormSection title='Название (опционально)'>
                    <PlatformFormInput
                        placeholder='Например: Займ на развитие'
                        value={formData.name}
                        onChange={handleNameChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Тип'>
                    <PlatformFormVariants
                        options={[
                            {
                                value: 'debt',
                                label: 'Взяли в долг',
                                // icon: <Debt />
                            },
                            {
                                value: 'credit',
                                label: 'Дали в долг',
                                // icon: <Credit />
                            }
                        ]}
                        value={formData.type}
                        onChange={handleTypeChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Сумма'>
                    <PlatformFormInput
                        placeholder='0.00'
                        value={formData.total_amount}
                        onChange={handleAmountChange}
                        type='text'
                        disabled={isLoading}
                    />
                    {amountStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={amountStatusInfo.type}
                            message={amountStatusInfo.message}
                            icon={amountStatusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Валюта'>
                    <PlatformFormVariants
                        options={[
                            { value: 'RUB', label: '₽ RUB' }
                        ]}
                        value={formData.currency}
                        onChange={handleCurrencyChange}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Процентная ставка (годовых)'>
                    <PlatformFormInput
                        placeholder='0'
                        value={formData.interest_rate}
                        onChange={handleInterestChange}
                        type='text'
                        disabled={isLoading}
                    />
                    {interestStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={interestStatusInfo.type}
                            message={interestStatusInfo.message}
                            icon={interestStatusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Старт - конец займа'>
                    <div className={styles.dateRow}>
                        <PlatformFormInput
                            type='date'
                            value={formData.start_date}
                            onChange={(value) => handleDateChange('start_date', value)}
                            disabled={isLoading}
                            placeholder='Дата начала'
                        />
                        <PlatformFormInput
                            type='date'
                            value={formData.end_date}
                            onChange={(value) => handleDateChange('end_date', value)}
                            disabled={isLoading}
                            placeholder='Дата окончания'
                        />
                    </div>
                </PlatformFormSection>

                <PlatformFormSection 
                    title='Контрагент'
                    actions={[
                        {
                            children: formData.counterparty ? 'Изменить' : 'Выбрать',
                            variant: 'accent',
                            onClick: () => setIsModalChooseCounterpartyOpen(true),
                            disabled: isLoading
                        }
                    ]}
                >
                    {formData.counterparty ? (
                        <div className={styles.counterpartyBlock}>
                            <CounterpartyCard 
                                counterparty={formData.counterparty}
                                showDefaultActions={false}
                            />
                        </div>
                    ) : (
                        <div className={styles.emptyCounterparty}>
                            Контрагент не выбран
                        </div>
                    )}
                    {counterpartyStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={counterpartyStatusInfo.type}
                            message={counterpartyStatusInfo.message}
                            icon={counterpartyStatusInfo.icon}
                        />
                    )}
                </PlatformFormSection>

                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder='Дополнительная информация'
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
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </section>
            </PlatformFormBody>

            {/* выбор контрагента */}
            <PlatformModal
                isOpen={isModalChooseCounterpartyOpen}
                onClose={() => setIsModalChooseCounterpartyOpen(false)}
                className={styles.modal}
            >
                <ChooseCounterpartyModal onSelectCounterparty={handleCounterpartySelect} />
            </PlatformModal>
        </>
    );
}