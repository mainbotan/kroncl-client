'use client';

import { useState } from 'react';
import styles from './card.module.scss';
import clsx from 'clsx';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Button from '@/assets/ui-kit/button/button';
import Exit from '@/assets/ui-kit/icons/exit';
import { FingerprintListItem } from '@/apps/account/fingerprints/types';

interface TokenCardProps {
    className?: string;
    fingerprint: FingerprintListItem;
    onRevoke?: (id: string) => void;
}

export function TokenCard({ fingerprint, className, onRevoke }: TokenCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'бессрочно';
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? styles.green : styles.red;
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Токен активен' : 'Токен отозван';
    };

    const handleRevoke = () => {
        if (onRevoke) {
            onRevoke(fingerprint.id);
        }
    };

    return (
        <div className={clsx(styles.token, className, isOpen && styles.open)}>
            <div className={styles.base} onClick={() => setIsOpen(!isOpen)}>
                <ModalTooltip content={getStatusText(fingerprint.status)}>
                    <span className={clsx(styles.indicator, getStatusColor(fingerprint.status))} />
                </ModalTooltip>
                
                <span className={clsx(styles.section, styles.secondary)}>{fingerprint.masked_key}</span>
                
                <ModalTooltip content='Дата создания'>
                    <span className={clsx(styles.section)}>
                        {new Date(fingerprint.created_at).toLocaleDateString('ru-RU')}
                    </span>
                </ModalTooltip>
                
                <span className={clsx(styles.section)}>
                    Истекает {formatDate(fingerprint.expired_at)}
                </span>
            </div>
            
            {isOpen && (
                <div className={styles.details}>
                    <div className={styles.group}>
                        <section className={styles.section}>
                            <div className={styles.key}>ID токена</div>
                            <div className={styles.value}>{fingerprint.id}</div>
                        </section>
                        <section className={styles.section}>
                            <div className={styles.key}>Статус</div>
                            <div className={styles.value}>
                                {fingerprint.status === 'active' ? 'Активен' : 'Отозван'}
                            </div>
                        </section>
                    </div>
                    
                    <div className={styles.group}>
                        <section className={styles.section}>
                            <div className={styles.key}>Создан</div>
                            <div className={styles.value}>
                                {new Date(fingerprint.created_at).toLocaleString('ru-RU')}
                            </div>
                        </section>

                        {fingerprint.last_used_at && (
                            <section className={styles.section}>
                                <div className={styles.key}>Последнее использование</div>
                                <div className={styles.value}>
                                    {new Date(fingerprint.last_used_at).toLocaleString('ru-RU')}
                                </div>
                            </section>
                        )}
                        {fingerprint.expired_at && (
                            <section className={styles.section}>
                                <div className={styles.key}>Истекает</div>
                                <div className={styles.value}>
                                    {new Date(fingerprint.expired_at).toLocaleString('ru-RU')}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* actions */}
                    {fingerprint.status === 'active' && (
                    <div className={styles.actions}>
                        <ModalTooltip side='left' content='Деактивация токена приведет к невозможности входа по нему.'>
                            <Button 
                                onClick={handleRevoke}
                                className={styles.action} 
                                variant='glass' 
                                icon={<Exit />}
                                disabled={fingerprint.status !== 'active'}
                            >
                                Деактивировать
                            </Button>
                        </ModalTooltip>
                    </div>
                    )}
                </div>
            )}
        </div>
    );
}