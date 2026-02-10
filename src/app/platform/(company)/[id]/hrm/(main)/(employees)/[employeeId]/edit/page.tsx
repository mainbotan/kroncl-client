'use client';

import { PlatformFormBody, PlatformFormInput, PlatformFormSection, PlatformFormStatus, PlatformFormUnify } from "@/app/platform/components/lib/form";
import { PlatformHead } from "@/app/platform/components/lib/head/head";
import Button from "@/assets/ui-kit/button/button";
import SuccessStatus from "@/assets/ui-kit/icons/success-status";
import ErrorStatus from "@/assets/ui-kit/icons/error-status";
import { useEffect, useState } from 'react';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useHrm } from '@/apps/company/modules';
import { useParams, useRouter } from 'next/navigation';
import { Employee } from "@/apps/company/modules/hrm/types";
import Spinner from "@/assets/ui-kit/spinner/spinner";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const employeeId = params.employeeId as string;
    const hrmModule = useHrm();
    const router = useRouter();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDropOpen, setIsModalDropOpen] = useState(false);
    const { showMessage } = useMessage();

    // первоначальная загрузка карты
    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!employeeId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await hrmModule.getEmployee(employeeId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setEmployee(response.data);
                } else {
                    setError("Не удалось загрузить данные сотрудника");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading employee ${employeeId}:`, err);
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
    }, [employeeId]);
    
    // установка начального состояния формы
    useEffect(() => {
        if (employee) {
            setFormData({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                phone: employee.phone || ''
            });
            
            setValidation({
                first_name: validateFirstName(employee.first_name || ''),
                last_name: validateLastName(employee.last_name || ''),
                email: validateEmail(employee.email || ''),
                phone: validatePhone(employee.phone || '')
            });
        }
    }, [employee]);

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
        if (!validation.first_name.isValid || loading) {
            showMessage({
                label: 'Проверьте правильность заполнения полей',
                variant: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            const updateData: any = {
                first_name: formData.first_name.trim()
            };

            // Отправляем пустую строку для удаления значений
            updateData.last_name = formData.last_name.trim();
            updateData.email = formData.email.trim();
            updateData.phone = formData.phone.trim();

            const response = await hrmModule.updateEmployee(employee!.id, updateData);

            if (response.status) {
                showMessage({
                    label: 'Карта сотрудника успешно обновлена',
                    variant: 'success'
                });
                router.push(`/platform/${companyId}/hrm/${employeeId}`);
            } else {
                throw new Error(response.message || 'Ошибка обновления сотрудника');
            }
        } catch (error: any) {
            showMessage({
                label: error.message || 'Не удалось обновить карту сотрудника',
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = validation.first_name.isValid && validation.last_name.isValid && 
                        validation.email.isValid && validation.phone.isValid;

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

    if (!employee) return (
        <div style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
        }}>
            Не удалось загрузить карту сотрудника
        </div>
    );

    return (
        <>
            <PlatformHead
                title='Обновление карты сотрудника'
                description={`Номер карты: ${employee.id}`}
            />
            <PlatformFormBody>
                <PlatformFormSection title='Имя, фамилия сотрудника'>
                    <PlatformFormUnify>
                        <PlatformFormInput
                            placeholder="Имя"
                            value={formData.first_name}
                            onChange={handleFirstNameChange}
                            disabled={loading}
                        />
                        <PlatformFormInput 
                            placeholder="Фамилия (опционально)"
                            variant="empty"
                            value={formData.last_name}
                            onChange={handleLastNameChange}
                            disabled={loading}
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
                        disabled={loading}
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
                        disabled={loading}
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
                        disabled={!isFormValid || loading}
                    >
                        {loading ? 'Обновление...' : 'Обновить карту'}
                    </Button>
                </section>
            </PlatformFormBody>
        </>
    );
}