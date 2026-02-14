'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormVariants } from '@/app/platform/components/lib/form';
import Button from '@/assets/ui-kit/button/button';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { CurrencyType, TransactionCategory } from '@/apps/company/modules/fm/types';
import { ChooseCategoryBlock } from './choose-category/block';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { ChooseEmployeeModal } from './choose-employee-modal/modal';
import { Employee } from '@/apps/company/modules/hrm/types';
import { EmployeeCard } from '../../../hrm/components/employee-card/card';
import { useFm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';

type Direction = 'income' | 'expense';
type AmountStatus = 'idle' | 'valid' | 'invalid';
type EmployeeStatus = 'idle' | 'valid' | 'invalid';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const searchParams = useSearchParams();
    const fmModule = useFm();
    const router = useRouter();
    const { showMessage } = useMessage();
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        direction: 'expense' as Direction,
        currency: 'RUB' as CurrencyType,
        comment: '',
        categoryId: null as string | null,
        employee: null as Employee | null
    });

    const [amountStatus, setAmountStatus] = useState<AmountStatus>('idle');
    const [amountMessage, setAmountMessage] = useState('');
    const [employeeStatus, setEmployeeStatus] = useState<EmployeeStatus>('idle');
    const [isModalChooseEmployeeOpen, setIsModalChooseEmployeeOpen] = useState(false);

    // Инициализация из URL параметра
    useEffect(() => {
        const directionParam = searchParams.get('direction');
        if (directionParam === 'income' || directionParam === 'expense') {
            setFormData(prev => ({ ...prev, direction: directionParam }));
        }
    }, [searchParams]);

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

    const validateEmployee = (employee: Employee | null): { status: EmployeeStatus; message: string } => {
        if (!employee) {
            return { status: 'invalid', message: 'Выберите ответственного сотрудника' };
        }
        return { status: 'valid', message: 'Сотрудник выбран' };
    };

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^\d.]/g, '');
        setFormData(prev => ({ ...prev, amount: cleaned }));
        
        const validation = validateAmount(cleaned);
        setAmountStatus(validation.status);
        setAmountMessage(validation.message);
    };

    const handleDirectionChange = (value: string) => {
        setFormData(prev => ({ ...prev, direction: value as Direction }));
    };

    const handleCurrencyChange = (value: string) => {
        setFormData(prev => ({ ...prev, currency: value as CurrencyType }));
    };

    const handleCategorySelect = (category: TransactionCategory | null) => {
        setFormData(prev => ({ 
            ...prev, 
            categoryId: category?.id || null 
        }));
    };

    const handleEmployeeSelect = (employee: Employee) => {
        setFormData(prev => ({ ...prev, employee }));
        setEmployeeStatus(validateEmployee(employee).status);
        setIsModalChooseEmployeeOpen(false);
    };

    const handleCommentChange = (value: string) => {
        setFormData(prev => ({ ...prev, comment: value }));
    };

    const handleSubmit = async () => {
        const employeeValidation = validateEmployee(formData.employee);
        setEmployeeStatus(employeeValidation.status);

        if (amountStatus !== 'valid' || employeeValidation.status !== 'valid' || isLoading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fmModule.createTransaction({
                base_amount: parseFloat(formData.amount),
                currency: formData.currency,
                direction: formData.direction,
                employee_id: formData.employee!.id,
                comment: formData.comment || undefined,
                category_id: formData.categoryId || undefined
            });

            if (response.status) {
                showMessage({
                    label: 'Операция успешно создана',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/fm`);
            } else {
                throw new Error(response.message || 'Ошибка создания операции');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать операцию',
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

    const getEmployeeStatusInfo = () => {
        switch (employeeStatus) {
            case 'valid':
                return {
                    type: 'success' as const,
                    icon: <SuccessStatus />,
                    message: 'Сотрудник выбран'
                };
            case 'invalid':
                return {
                    type: 'error' as const,
                    icon: <ErrorStatus />,
                    message: 'Выберите ответственного сотрудника'
                };
            default:
                return {
                    type: 'info' as const,
                    icon: null,
                    message: ''
                };
        }
    };

    const isFormValid = amountStatus === 'valid' && employeeStatus === 'valid';
    const amountStatusInfo = getAmountStatusInfo();
    const employeeStatusInfo = getEmployeeStatusInfo();

    return (
        <>
            <PlatformHead
                title='Новая операция'
                description={formData.direction === 'income' ? 'Доход' : 'Расход'}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Сумма'>
                    <PlatformFormInput
                        placeholder='0.00'
                        value={formData.amount}
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

                <PlatformFormSection title='Тип операции'>
                    <PlatformFormVariants
                        options={[
                            {
                                value: 'expense',
                                label: 'Расход',
                            },
                            {
                                value: 'income',
                                label: 'Доход',
                            }
                        ]}
                        value={formData.direction}
                        onChange={handleDirectionChange}
                        disabled={isLoading}
                    />
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

                <PlatformFormSection 
                    title='Ответственный сотрудник'
                    actions={[
                        {
                            children: formData.employee ? 'Изменить' : 'Выбрать',
                            variant: 'accent',
                            onClick: () => setIsModalChooseEmployeeOpen(true),
                            disabled: isLoading
                        }
                    ]}
                >
                    {formData.employee ? (
                        <div className={styles.employeeBlock}>
                            <EmployeeCard 
                                employee={formData.employee}
                                variant='default'
                            />
                        </div>
                    ) : (
                        <div className={styles.emptyEmployee}>
                            Сотрудник не выбран
                        </div>
                    )}
                    {employeeStatus !== 'idle' && (
                        <PlatformFormStatus
                            type={employeeStatusInfo.type}
                            message={employeeStatusInfo.message}
                            icon={employeeStatusInfo.icon}
                        />
                    )}
                </PlatformFormSection>
                
                <PlatformFormSection title='Категория (опционально)'>
                    <ChooseCategoryBlock 
                        direction={formData.direction} 
                        className={styles.categoryBlock}
                        onSelect={handleCategorySelect}
                        disabled={isLoading}
                    />
                </PlatformFormSection>

                <PlatformFormSection title='Комментарий (опционально)'>
                    <PlatformFormInput
                        placeholder='Назначение платежа...'
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
                        {isLoading ? 'Создание...' : 'Создать операцию'}
                    </Button>
                </section>
            </PlatformFormBody>

            {/* выбор сотрудника */}
            <PlatformModal
                isOpen={isModalChooseEmployeeOpen}
                onClose={() => setIsModalChooseEmployeeOpen(false)}
                className={styles.modal}
            >
                <ChooseEmployeeModal onSelectEmployee={handleEmployeeSelect} />
            </PlatformModal>
        </>
    );
}