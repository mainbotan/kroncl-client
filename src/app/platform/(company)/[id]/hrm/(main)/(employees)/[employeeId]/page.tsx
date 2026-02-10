'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useAccounts, useHrm } from "@/apps/company/modules";
import { Employee } from "@/apps/company/modules/hrm/types";
import Edit from "@/assets/ui-kit/icons/edit";
import Exit from "@/assets/ui-kit/icons/exit";
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { getGradientFromString } from "@/assets/utils/avatars";
import { formatDate } from "@/assets/utils/date";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import styles from './page.module.scss';
import Button from "@/assets/ui-kit/button/button";
import { EmployeeWidget } from "./widget/widget";
import { formatPhoneNumber } from "@/assets/utils/phone-utils";
import Question from "@/assets/ui-kit/icons/question";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";

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

    // функции обработки
    const handleDrop = async () => {
        try {
            await hrmModule.deleteEmployee(employee!.id);
            showMessage({
                label: 'Сотрудник удалён.',
                variant: 'success'
            });
            setIsModalDropOpen(false);
            router.push(`/platform/${companyId}/hrm`);
        } catch (error: any) {
            const errorMessage = error.message || 'Внутренняя ошибка системы.'
            showMessage({
                label: 'Не удалось удалить карту сотрудника.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

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

    const fullName = `${employee.first_name} ${employee.last_name ? employee.last_name : ''}`;
    const initials = `${employee.first_name[0]}${employee.last_name ? employee.last_name[0] : ''}`;
    const avatarGradient = getGradientFromString(fullName);

    return (
        <>
            <PlatformHead
                title={`${fullName}`}
                description={`Карта сотрудника ${fullName}, создана ${formatDate(employee.created_at)}`}
                actions={[
                    {
                        children: 'Редактировать',
                        icon: <Edit />,
                        variant: 'accent',
                        as: 'link',
                        href: `/platform/${companyId}/hrm/${employeeId}/edit`
                    }, {
                        children: 'Удалить',
                        icon: <Exit />,
                        variant: 'empty',
                        onClick: () => setIsModalDropOpen(true)
                    }
                ]}
            />
            <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Базовая информация</div>
                    <div className={styles.description}>Контактные данные сотрудника</div>
                    <div className={styles.variants}>
                        <EmployeeWidget
                            value={fullName}
                            legend="Полное имя"
                            action="copy"
                            variant="accent"
                        />
                        {employee.phone && (
                            <EmployeeWidget
                                value={formatPhoneNumber(employee.phone)}
                                legend="Рабочий номер"
                                action="copy"
                            />
                        )}
                        {employee.email && (
                            <EmployeeWidget
                                value={employee.email}
                                legend="Корпоративная почта"
                                action="copy"
                            />
                        )}
                    </div>
                </section>
                <section className={styles.section}>
                    <div className={styles.capture}>Аккаунт</div>
                    <div className={styles.description}>
                        <Question /> У сотрудника может не быть аккаунта в системе - это нормально для организаций, в которых централизованный учёт ведут менеджеры.
                    </div>
                    <div className={styles.variants}>
                    </div>
                </section>
            </div>

            {/* drop account */}
            <PlatformModal
                isOpen={isModalDropOpen}
                onClose={() => setIsModalDropOpen(false)}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Удалить сотрудника?'
                    description='Запись сотрудника, включая историю всех действий, будет навсегда удалена.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDropOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDrop,
                            children: 'Удалить навсегда'
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}