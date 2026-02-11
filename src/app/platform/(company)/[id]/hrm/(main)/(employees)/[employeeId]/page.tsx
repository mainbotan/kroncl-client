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
import { EmployeeWidget } from "./components/widget/widget";
import { formatPhoneNumber } from "@/assets/utils/phone-utils";
import Question from "@/assets/ui-kit/icons/question";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { PlatformModalConfirmation } from "@/app/platform/components/lib/modal/confirmation/confirmation";
import { useMessage } from "@/app/platform/components/lib/message/provider";
import PaperClip from "@/assets/ui-kit/icons/paper-clip";
import { MemberCard } from "../../../../accesses/components/member-card/card";
import { CompanyAccount } from "@/apps/company/modules/accounts/types";
import { ModalSelectAccount } from "./components/modal-select-account/modal";
import { motion, AnimatePresence } from 'framer-motion';
import { sectionVariants, widgetVariants, accountCardVariants } from "./_animations";

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const employeeId = params.employeeId as string;
    const hrmModule = useHrm();
    const accountsModule = useAccounts();
    const router = useRouter();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDropOpen, setIsModalDropOpen] = useState(false);
    const [isModalSelectAccountOpen, setIsModalSelectAccountOpen] = useState(false);
    const { showMessage } = useMessage();

    // привязанный аккаунт
    const [account, setAccount] = useState<CompanyAccount | null>(null);
    const [accountLoading, setAccountLoading] = useState(false);

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

    // Добавить useEffect для загрузки аккаунта
    useEffect(() => {
        const fetchAccount = async () => {
            if (employee?.account_id) {
                setAccountLoading(true);
                try {
                    const response = await accountsModule.getAccount(employee.account_id);
                    if (response.status) {
                        setAccount(response.data);
                    }
                } catch (err) {
                    console.error('Error loading account:', err);
                } finally {
                    setAccountLoading(false);
                }
            }
        };
        
        if (employee?.is_account_linked && employee.account_id) {
            fetchAccount();
        } else {
            setAccount(null);
        }
    }, [employee]);

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
                label: 'Не удалось диактивировать карту сотрудника.',
                variant: 'error',
                about: errorMessage
            });
        }
    };

    const handleUnlinkAccount = async () => {
        try {
            const response = await hrmModule.unlinkAccountFromEmployee(employeeId);
            if (response.status) {
                setEmployee(response.data);
                setAccount(null);
                showMessage({
                    label: 'Аккаунт отвязан',
                    variant: 'success'
                });
            }
        } catch (error: any) {
            showMessage({
                label: 'Не удалось отвязать аккаунт',
                variant: 'error',
                about: error.message
            });
        }
    };

    if (loading) return (
        <motion.div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Spinner />
        </motion.div>
    );
    
    if (error) return (
        <motion.div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {error}
        </motion.div>
    );

    if (!employee) return (
        <motion.div 
            style={{
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: ".7em", 
                color: "var(--color-text-description)", 
                minHeight: "10rem"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            Не удалось загрузить карту сотрудника
        </motion.div>
    );

    const fullName = `${employee.first_name} ${employee.last_name ? employee.last_name : ''}`;
    const initials = `${employee.first_name[0]}${employee.last_name ? employee.last_name[0] : ''}`;
    const avatarGradient = getGradientFromString(fullName);

    const widgets = [
        { value: fullName, legend: "Полное имя", variant: "accent" as const },
        ...(employee.phone ? [{ value: formatPhoneNumber(employee.phone), legend: "Рабочий номер", variant: "default" as const }] : []),
        ...(employee.email ? [{ value: employee.email, legend: "Корпоративная почта", variant: "default" as const }] : [])
    ];

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
            
            <motion.div 
                className={styles.body}
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
            >
                <motion.section 
                    className={styles.section}
                    variants={sectionVariants}
                >
                    <div className={styles.capture}>Базовая информация</div>
                    <div className={styles.description}>Контактные данные сотрудника</div>
                    <div className={styles.variants}>
                        {widgets.map((widget, index) => (
                            <motion.div
                                key={widget.legend}
                                custom={index}
                                variants={widgetVariants}
                            >
                                <EmployeeWidget
                                    value={widget.value}
                                    legend={widget.legend}
                                    action="copy"
                                    variant={widget.variant}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
                
                <motion.section 
                    className={styles.section}
                    variants={sectionVariants}
                >
                    <div className={styles.unify}>
                        <div className={styles.capture}>Аккаунт</div>
                        <Button 
                            onClick={() => setIsModalSelectAccountOpen(true)} 
                            icon={<PaperClip />} 
                            className={styles.action} 
                            variant="light"
                        >
                            {employee.is_account_linked ? 'Изменить' : 'Выбрать'}
                        </Button>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        {employee.is_account_linked && accountLoading && (
                            <motion.div 
                                key="loading"
                                style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <Spinner />
                            </motion.div>
                        )}
                        
                        {employee.is_account_linked && !accountLoading && account && (
                            <motion.div
                                key="account-card"
                                variants={accountCardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                            >
                                <MemberCard 
                                    className={styles.account} 
                                    account={account} 
                                    showDefaultActions={false}
                                    actions={[
                                        {
                                            children: 'Отвязать',
                                            variant: 'light',
                                            onClick: handleUnlinkAccount
                                        }
                                    ]}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className={styles.note}>
                        <div className={styles.description}>
                            <Question /> У сотрудника может не быть аккаунта в системе - это нормально для организаций, в которых централизованный учёт ведут менеджеры.
                        </div>
                    </div>
                </motion.section>
            </motion.div>

            {/* drop account */}
            <PlatformModal
                isOpen={isModalDropOpen}
                onClose={() => setIsModalDropOpen(false)}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Диактивировать сотрудника?'
                    description='Карта сотрудника будет диактивирована. Мы не удалим её, но последующие действия с картой будут заблокированы.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDropOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDrop,
                            children: 'Удалить'
                        }
                    ]}
                />
            </PlatformModal>

            {/* modal select account */}
            <PlatformModal
                isOpen={isModalSelectAccountOpen}
                onClose={() => setIsModalSelectAccountOpen(false)}
                className={styles.modal}
            >
                <ModalSelectAccount 
                    onSelectAccount={(accountId) => {
                        setEmployee(prev => prev ? {
                            ...prev,
                            account_id: accountId,
                            is_account_linked: true
                        } : null);
                        setIsModalSelectAccountOpen(false);
                        
                        accountsModule.getAccount(accountId).then(response => {
                            if (response.status) {
                                setAccount(response.data);
                            }
                        });
                    }}
                />
            </PlatformModal>
        </>
    );
}