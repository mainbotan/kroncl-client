'use client';

import clsx from "clsx";
import styles from './block.module.scss';
import { DealBlock } from "../block/block";
import { Employee } from "@/apps/company/modules/hrm/types";
import { EmployeeCard } from "@/app/platform/(company)/[id]/hrm/components/employee-card/card";
import { PlatformModal } from "@/app/platform/components/lib/modal/modal";
import { ChooseEmployeeModal } from "@/app/platform/(company)/[id]/fm/(main)/new-operation/choose-employee-modal/modal";
import { useState } from "react";

export interface EmployeesBlockProps {
    className?: string;
    selectedIds?: string[];
    onSelect?: (employeeIds: string[]) => void;
    disabled?: boolean;
    employees?: Employee[]; // готовые данные сотрудников из родителя
}

export function EmployeesBlock({
    className,
    selectedIds = [],
    onSelect,
    disabled = false,
    employees = []
}: EmployeesBlockProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleSelectEmployee = (employee: Employee) => {
        // Если сотрудник уже выбран - игнорим
        if (selectedIds.includes(employee.id)) {
            setIsModalOpen(false);
            return;
        }

        // Добавляем ID
        const newSelected = [...selectedIds, employee.id];
        
        if (onSelect) {
            onSelect(newSelected);
        }
        setIsModalOpen(false);
    };

    const handleRemoveEmployee = (employeeId: string) => {
        const newSelected = selectedIds.filter(id => id !== employeeId);
        
        if (onSelect) {
            onSelect(newSelected);
        }
    };

    const getBlockDescription = () => {
        if (selectedIds.length === 0) {
            return "Ответственные сотрудники ещё не указаны.";
        }
        return `Выбрано сотрудников: ${selectedIds.length}`;
    };

    // Фильтруем сотрудников, которые есть в selectedIds
    const selectedEmployees = employees.filter(emp => selectedIds.includes(emp.id));

    return (
        <>
            <DealBlock
                title="Сотрудники"
                description={getBlockDescription()}
                className={className}
                actions={[
                    {
                        variant: 'accent',
                        children: 'Добавить',
                        onClick: handleAddClick,
                        disabled
                    }
                ]}
            >
                <div className={styles.list}>
                    {selectedEmployees.map((employee) => (
                        <div key={employee.id} className={styles.item}>
                            <EmployeeCard 
                                employee={employee}
                                variant="default"
                                showDefaultActions={false}
                                actions={[
                                    {
                                        children: 'Открепить',
                                        variant: 'light',
                                        onClick: () => handleRemoveEmployee(employee.id),
                                        disabled,
                                        className: styles.button
                                    }
                                ]}
                            />
                        </div>
                    ))}
                </div>
            </DealBlock>

            <PlatformModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className={styles.modal}
            >
                <ChooseEmployeeModal 
                    onSelectEmployee={handleSelectEmployee}
                />
            </PlatformModal>
        </>
    );
}