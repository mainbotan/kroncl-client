'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './modal.module.scss';
import { ClientCard } from '../client-card/card';
import { useParams } from 'next/navigation';
import { useCrm } from '@/apps/company/modules';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { useEffect, useState } from 'react';
import { ClientsResponse, ClientDetail } from '@/apps/company/modules/crm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { listVariants, itemVariants } from './_animations';

export function ChooseClientModal({ 
    onSelectClient 
}: { 
    onSelectClient: (client: ClientDetail) => void 
}) {
    const params = useParams();
    const companyId = params.id as string;
    const crmModule = useCrm();
    const { showMessage } = useMessage();

    const [data, setData] = useState<ClientsResponse | null>(null);
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
            const response = await crmModule.getClients({
                page: 1,
                limit: 20,
                search: search || undefined
            });
            
            if (response.status) {
                setData(response.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка загрузки");
            console.error('Error loading clients:', err);
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

    const clients = data?.clients || [];

    return (
        <div className={styles.modal}>
            <div className={styles.capture}>Выберите клиента</div>
            <Input 
                fullWidth 
                type='text' 
                variant='light' 
                placeholder='Поиск по имени, телефону, email...' 
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
                        <>
                        {clients.map((client) => (
                                <ClientCard 
                                    key={client.id}
                                    client={client}
                                    variant='minimalistic'
                                    selectable
                                    className={styles.item}
                                    showActions={true}
                                    onSelect={onSelectClient}
                                />
                        ))}
                        
                        {clients.length === 0 && (
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
                                {searchValue ? 'Клиенты не найдены' : 'Клиенты не найдены'}
                            </motion.div>
                        )}
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}