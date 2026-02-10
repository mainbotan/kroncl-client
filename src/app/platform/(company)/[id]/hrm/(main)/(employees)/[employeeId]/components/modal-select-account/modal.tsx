'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './modal.module.scss';
import { MemberCard } from '@/app/platform/(company)/[id]/accesses/components/member-card/card';
import PaperClip from '@/assets/ui-kit/icons/paper-clip';
import { useParams } from 'next/navigation';
import { useAccounts, useHrm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useEffect, useState } from 'react';
import { CompanyAccountsResponse } from '@/apps/company/modules/accounts/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { listVariants, itemVariants } from './_animations';

export function ModalSelectAccount({ 
    onSelectAccount 
}: { 
    onSelectAccount: (accountId: string) => void 
}) {
    const params = useParams();
    const companyId = params.id as string;
    const employeeId = params.employeeId as string;
    const hrmModule = useHrm();
    const accountsModule = useAccounts();
    const { showMessage } = useMessage();

    // получение аккаунтов
    const [data, setData] = useState<CompanyAccountsResponse | null>(null);
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
            const response = await accountsModule.getAll({
                page: 1,
                limit: 20,
                search: search || undefined,
                role: undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading accounts:', err);
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

    const handleSelectAccount = async (accountId: string) => {
        try {
            const response = await hrmModule.linkAccountToEmployee(employeeId, accountId);
            if (response.status) {
                onSelectAccount(accountId);
            }
        } catch (error: any) {
            showMessage({
                label: 'Не удалось привязать аккаунт',
                variant: 'error',
                about: error.message
            });
        }
    };

    const accounts = data?.accounts || [];

    return (
        <div className={styles.modal}>
            <div className={styles.capture}>Выберите аккаунт</div>
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
                                {accounts.map((account) => (
                                    <motion.div
                                        key={account.id}
                                        variants={itemVariants}
                                        layout
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <MemberCard 
                                            account={account}
                                            showDefaultActions={false}
                                            actions={[
                                                {
                                                    children: 'Выбрать',
                                                    variant: 'accent',
                                                    icon: <PaperClip />,
                                                    onClick: () => handleSelectAccount(account.id)
                                                }
                                            ]}
                                        />
                                    </motion.div>
                                ))}
                                
                                {accounts.length === 0 && (
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
                                        {searchValue ? 'Аккаунты не найдены' : 'Аккаунты не найдены'}
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