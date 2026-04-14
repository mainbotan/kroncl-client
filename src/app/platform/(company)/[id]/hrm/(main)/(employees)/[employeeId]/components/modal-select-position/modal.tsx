'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './modal.module.scss';
import { PositionCard } from '../../../../../components/position-card/card';
import { useParams } from 'next/navigation';
import { useHrm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useEffect, useState } from 'react';
import { PositionsResponse } from '@/apps/company/modules/hrm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { listVariants, itemVariants } from './../modal-select-account/_animations';

export function ModalSelectPosition({ 
    employeeId,
    onSelectPosition 
}: { 
    employeeId: string;
    onSelectPosition: (positionId: string) => void 
}) {
    const params = useParams();
    const companyId = params.id as string;
    const hrmModule = useHrm();
    const { showMessage } = useMessage();

    const [data, setData] = useState<PositionsResponse | null>(null);
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
            const response = await hrmModule.getPositions({
                page: 1,
                limit: 20,
                search: search || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading positions:', err);
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

    const handleSelectPosition = async (positionId: string) => {
        try {
            const response = await hrmModule.linkPositionToEmployee(employeeId, positionId);
            if (response.status) {
                onSelectPosition(positionId);
            }
        } catch (error: any) {
            showMessage({
                label: 'Не удалось привязать должность',
                variant: 'error',
                about: error.message
            });
        }
    };

    const positions = data?.positions || [];

    return (
        <div className={styles.modal}>
            <div className={styles.capture}>Выберите должность</div>
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
                                {positions.map((position) => (
                                    <motion.div
                                        key={position.id}
                                        variants={itemVariants}
                                        layout
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <PositionCard 
                                            position={position}
                                            showDefaultActions={false}
                                            className={styles.item}
                                            variant='compact'
                                            actions={[
                                                {
                                                    children: 'Выбрать',
                                                    variant: 'accent',
                                                    onClick: () => handleSelectPosition(position.id)
                                                }
                                            ]}
                                        />
                                    </motion.div>
                                ))}
                                
                                {positions.length === 0 && (
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
                                        {searchValue ? 'Должности не найдены' : 'Должности не найдены'}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}