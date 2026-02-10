'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormUnify } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useHrm } from '@/apps/company/modules';
import { useRouter } from 'next/navigation';

export default function Page() {
    const hrmModule = useHrm();
    const { showMessage } = useMessage();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });
    
    const [validation, setValidation] = useState({
        first_name: { isValid: false, message: '' },
        last_name: { isValid: true, message: '' },
        email: { isValid: true, message: '' },
        phone: { isValid: true, message: '' }
    });

    const validateFirstName = (value: string) => {
        const trimmed = value.trim();
        return {
            isValid: trimmed.length >= 2,
            message: trimmed.length >= 2 ? 'Корректное имя' : 'Имя должно быть не менее 2 символов'
        };
    };

    const validateLastName = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return { isValid: true, message: '' };
        return {
            isValid: trimmed.length >= 2,
            message: trimmed.length >= 2 ? 'Корректная фамилия' : 'Фамилия должна быть не менее 2 символов'
        };
    };

    const validateEmail = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return { isValid: true, message: '' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: emailRegex.test(trimmed),
            message: emailRegex.test(trimmed) ? 'Корректный email' : 'Некорректный формат email'
        };
    };

    const validatePhone = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return { isValid: true, message: '' };
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return {
            isValid: phoneRegex.test(trimmed),
            message: phoneRegex.test(trimmed) ? 'Корректный номер' : 'Некорректный формат номера'
        };
    };

    const handleFirstNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, first_name: value }));
        setValidation(prev => ({ ...prev, first_name: validateFirstName(value) }));
    };

    const handleLastNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, last_name: value }));
        setValidation(prev => ({ ...prev, last_name: validateLastName(value) }));
    };

    const handleEmailChange = (value: string) => {
        setFormData(prev => ({ ...prev, email: value }));
        setValidation(prev => ({ ...prev, email: validateEmail(value) }));
    };

    const handlePhoneChange = (value: string) => {
        setFormData(prev => ({ ...prev, phone: value }));
        setValidation(prev => ({ ...prev, phone: validatePhone(value) }));
    };

    const handleSubmit = async () => {
        if (!validation.first_name.isValid || !validation.last_name.isValid || 
            !validation.email.isValid || !validation.phone.isValid || isLoading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await hrmModule.createEmployee({
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim() || undefined,
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined
            });

            if (response.status) {
                showMessage({
                    label: 'Карта сотрудника успешно создана',
                    variant: 'success'
                });
                router.back();
            } else {
                throw new Error(response.message || 'Ошибка создания сотрудника');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось создать карту сотрудника',
                variant: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = validation.first_name.isValid && validation.last_name.isValid && 
                        validation.email.isValid && validation.phone.isValid;

    return (
        <>
            <PlatformHead
                title='Новый сотрудник'
                description="Инициализация карты нового сотрудника организации."
            />
            <PlatformFormBody>
                <PlatformFormSection title='Имя, фамилия сотрудника'>
                    <PlatformFormUnify>
                        <PlatformFormInput
                            placeholder="Имя"
                            value={formData.first_name}
                            onChange={handleFirstNameChange}
                            disabled={isLoading}
                        />
                        <PlatformFormInput 
                            placeholder="Фамилия (опционально)"
                            variant="empty"
                            value={formData.last_name}
                            onChange={handleLastNameChange}
                            disabled={isLoading}
                        />
                    </PlatformFormUnify>
                    {validation.first_name.message && (
                        <PlatformFormStatus
                            type={validation.first_name.isValid ? "success" : "error"}
                            message={validation.first_name.message}
                            icon={validation.first_name.isValid ? <SuccessStatus /> : <ErrorStatus />}
                        />
                    )}
                </PlatformFormSection>
                <PlatformFormSection title='Рабочий номер (опционально)'>
                    <PlatformFormInput
                        placeholder="+7"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        disabled={isLoading}
                    />
                    {validation.phone.message && (
                        <PlatformFormStatus
                            type={validation.phone.isValid ? "success" : "error"}
                            message={validation.phone.message}
                            icon={validation.phone.isValid ? <SuccessStatus /> : <ErrorStatus />}
                        />
                    )}
                </PlatformFormSection>
                <PlatformFormSection title='Рабочая почта (опционально)'>
                    <PlatformFormInput
                        placeholder="@"
                        value={formData.email}
                        onChange={handleEmailChange}
                        disabled={isLoading}
                    />
                    {validation.email.message && (
                        <PlatformFormStatus
                            type={validation.email.isValid ? "success" : "error"}
                            message={validation.email.message}
                            icon={validation.email.isValid ? <SuccessStatus /> : <ErrorStatus />}
                        />
                    )}
                </PlatformFormSection>
                <section>
                    <Button
                        variant="accent"
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Создание...' : 'Создать карту'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}