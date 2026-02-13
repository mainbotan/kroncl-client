'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './modal.module.scss';
import { EmployeeCard } from '../../../../hrm/components/employee-card/card';
import { useParams } from 'next/navigation';
import { useHrm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useEffect, useState } from 'react';
import { EmployeesResponse, Employee } from '@/apps/company/modules/hrm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { listVariants, itemVariants } from './_animations';

export function ChooseEmployeeModal({ 
    onSelectEmployee 
}: { 
    onSelectEmployee: (employee: Employee) => void 
}) {
    const params = useParams();
    const companyId = params.id as string;
    const hrmModule = useHrm();
    const { showMessage } = useMessage();

    const [data, setData] = useState<EmployeesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await hrmModule.getEmployees({
                page: 1,
                limit: 20,
                search: search || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        const timeout = setTimeout(() => {
            loadData(value);
        }, 300);
        
        setSearchTimeout(timeout);
    };

    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const employees = data?.employees || [];

    return (
        <div className={styles.modal}>
            <div className={styles.capture}>Выберите сотрудника</div>
            <Input 
                fullWidth 
                type='text' 
                variant='light' 
                placeholder='Поиск' 
                className={styles.input}
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            
            <div className={styles.list}>
                <AnimatePresence mode="wait">
                    {loading && (
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
                    
                    {!loading && (
                        <motion.div
                            key="content"
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            className={styles.listInner}
                        >
                            <AnimatePresence mode="popLayout">
                                {employees.map((employee) => (
                                    <motion.div
                                        key={employee.id}
                                        variants={itemVariants}
                                        layout
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <EmployeeCard 
                                            employee={employee}
                                            variant='compact'
                                            showDefaultActions={false}
                                            actions={[
                                                {
                                                    children: 'Выбрать',
                                                    variant: 'accent',
                                                    onClick: () => onSelectEmployee(employee)
                                                }
                                            ]}
                                        />
                                    </motion.div>
                                ))}
                                
                                {employees.length === 0 && (
                                    <motion.div 
                                        key="empty"
                                        style={{ 
                                            display: "flex", 
                                            justifyContent: "center", 
                                            padding: "2rem",
                                            color: "var(--color-text-description)",
                                            fontSize: "0.9em"
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {searchValue ? 'Сотрудники не найдены' : 'Сотрудники не найдены'}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}