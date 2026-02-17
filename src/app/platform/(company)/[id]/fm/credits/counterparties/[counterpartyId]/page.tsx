'use client';

import { PlatformHead } from '@/app/platform/components/lib/head/head';
import styles from './page.module.scss';
import { useParams, useRouter } from 'next/navigation';
import { useFm } from '@/apps/company/modules';
import { useEffect, useState } from 'react';
import { Counterparty } from '@/apps/company/modules/fm/types';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { motion } from 'framer-motion';
import Edit from '@/assets/ui-kit/icons/edit';
import Exit from '@/assets/ui-kit/icons/exit';
import { useMessage } from '@/app/platform/components/lib/message/provider';
import { PlatformModal } from '@/app/platform/components/lib/modal/modal';
import { PlatformModalConfirmation } from '@/app/platform/components/lib/modal/confirmation/confirmation';
import Button from '@/assets/ui-kit/button/button';
import { formatDate } from '@/assets/utils/date';
import clsx from 'clsx';

export default function Page() {
    const params = useParams();
    const companyId = params.id as string;
    const counterpartyId = params.counterpartyId as string;
    const fmModule = useFm();
    const router = useRouter();
    const { showMessage } = useMessage();

    const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalDropOpen, setIsModalDropOpen] = useState(false);
    const [isModalActivateOpen, setIsModalActivateOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            if (!counterpartyId) return;
            
            setLoading(true);
            setError(null);
            try {
                const response = await fmModule.getCounterparty(counterpartyId);
                
                if (!isMounted) return;
                
                if (response.status) {
                    setCounterparty(response.data);
                } else {
                    setError("Не удалось загрузить данные контрагента");
                }
            } catch (err) {
                if (!isMounted) return;
                
                setError(err instanceof Error ? err.message : "Ошибка загрузки");
                console.error(`Error loading counterparty ${counterpartyId}:`, err);
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
    }, [counterpartyId]);

    const handleDeactivate = async () => {
        try {
            const response = await fmModule.deactivateCounterparty(counterparty!.id);
            if (response.status) {
                showMessage({
                    label: 'Контрагент деактивирован',
                    variant: 'success'
                });
                setIsModalDropOpen(false);
                setCounterparty(response.data);
            }
        } catch (error: any) {
            showMessage({
                label: 'Не удалось деактивировать контрагента',
                variant: 'error',
                about: error.message
            });
        }
    };

    const handleActivate = async () => {
        try {
            const response = await fmModule.activateCounterparty(counterparty!.id);
            if (response.status) {
                showMessage({
                    label: 'Контрагент активирован',
                    variant: 'success'
                });
                setIsModalActivateOpen(false);
                setCounterparty(response.data);
            }
        } catch (error: any) {
            showMessage({
                label: 'Не удалось активировать контрагента',
                variant: 'error',
                about: error.message
            });
        }
    };

    const typeLabels = {
        bank: 'Банк',
        organization: 'Организация',
        person: 'Физлицо'
    };

    const isActive = counterparty?.status === 'active';

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

    if (!counterparty) return (
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
            Контрагент не найден
        </motion.div>
    );

    const actions = [
        {
            children: 'Редактировать',
            icon: <Edit />,
            variant: 'accent' as const,
            as: 'link' as const,
            href: `/platform/${companyId}/fm/credits/counterparties/${counterpartyId}/edit`
        }
    ];

    if (isActive) {
        actions.push({
            children: 'Деактивировать',
            icon: <Exit />,
            variant: 'accent',
            onClick: () => setIsModalDropOpen(true)
        });
    } else {
        actions.push({
            children: 'Активировать',
            icon: <Exit />,
            variant: 'accent',
            onClick: () => setIsModalActivateOpen(true)
        });
    }

    return (
        <>
            <PlatformHead
                title={counterparty.name}
                description={`${typeLabels[counterparty.type]}. Контрагент ${counterparty.id}. Статус: ${isActive ? 'активен' : 'неактивен'}.`}
                actions={actions}
            />
            
            {/* <div className={styles.body}>
                <section className={styles.section}>
                    <div className={styles.capture}>Основная информация</div>
                    
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <div className={styles.label}>Название</div>
                            <div className={styles.value}>{counterparty.name}</div>
                        </div>

                        {counterparty.comment && (
                            <div className={styles.field}>
                                <div className={styles.label}>Комментарий</div>
                                <div className={styles.value}>{counterparty.comment}</div>
                            </div>
                        )}

                        <div className={styles.field}>
                            <div className={styles.label}>Тип</div>
                            <div className={styles.value}>{typeLabels[counterparty.type]}</div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}>Статус</div>
                            <div className={clsx(styles.value, styles[isActive ? 'active' : 'inactive'])}>
                                {isActive ? 'Активен' : 'Неактивен'}
                            </div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}>Дата создания</div>
                            <div className={styles.value}>{formatDate(counterparty.created_at)}</div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.label}>Последнее обновление</div>
                            <div className={styles.value}>{formatDate(counterparty.updated_at)}</div>
                        </div>
                    </div>
                </section>
            </div> */}

            {/* modal deactivate */}
            <PlatformModal
                isOpen={isModalDropOpen}
                onClose={() => setIsModalDropOpen(false)}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Деактивировать контрагента?'
                    description='Контрагент будет деактивирован. Связанные кредиты останутся, но новые операции будут недоступны.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalDropOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleDeactivate,
                            children: 'Деактивировать'
                        }
                    ]}
                />
            </PlatformModal>

            {/* modal activate */}
            <PlatformModal
                isOpen={isModalActivateOpen}
                onClose={() => setIsModalActivateOpen(false)}
                className={styles.modal}
            >
                <PlatformModalConfirmation
                    title='Активировать контрагента?'
                    description='Контрагент будет активирован. С ним снова можно будет проводить операции.'
                    actions={[
                        {
                            children: 'Отмена', 
                            variant: 'light', 
                            onClick: () => setIsModalActivateOpen(false)
                        },
                        {
                            variant: "accent", 
                            onClick: handleActivate,
                            children: 'Активировать'
                        }
                    ]}
                />
            </PlatformModal>
        </>
    );
}