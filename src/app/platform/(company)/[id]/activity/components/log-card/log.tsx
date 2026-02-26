'use client';

import { useState } from 'react';
import SuccessStatus from '@/assets/ui-kit/icons/success-status';
import styles from './log.module.scss';
import ErrorStatus from '@/assets/ui-kit/icons/error-status';
import clsx from 'clsx';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Log } from '@/apps/company/modules/logs/types';

interface LogCardProps {
    className?: string;
    log: Log;
}

export function LogCard({ log, className }: LogCardProps) {
    const params = useParams();
    const companyId = params.id as string;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={clsx(styles.log, className, isOpen && styles.open)}>
            <div className={styles.base} onClick={() => setIsOpen(!isOpen)}>
                <span>
                    {log.status === 'success' && <SuccessStatus />}
                    {log.status === 'error' && <ErrorStatus className={styles.error} />}
                    {log.status === 'pending' && <span className={styles.pending}>⏳</span>}
                </span>
                <span className={styles.scale}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span 
                            key={i} 
                            className={clsx(
                                styles.col, 
                                i < log.criticality && styles.accent
                            )} 
                        />
                    ))}
                </span>
                <ModalTooltip content={`Для совершения действия необходимо разрешение ${log.key}`}>
                    <span className={styles.key}>{log.key}</span>
                </ModalTooltip>
                <ModalTooltip content='Аккаунт сотрудника'>
                    <Link href={`/platform/${companyId}/accounts/${log.account_id}`} className={styles.link}>
                        {log.account_id.slice(0, 8)}...
                    </Link>
                </ModalTooltip>
                <span className={styles.timestamp}>{log.created_at}</span>
            </div>
            
            {isOpen && (
                <div className={styles.details}>
                    <div className={styles.group}>
                        <section className={styles.section}>
                            <div className={styles.key}>Useragent</div>
                            <div className={styles.value}>{log.user_agent || 'не указано'}</div>
                        </section>
                    </div>
                    
                    {log.metadata && (
                        <>
                            {/* Сначала отображаем все простые поля metadata (не объекты) */}
                            {Object.entries(log.metadata)
                                .filter(([_, value]) => 
                                    typeof value !== 'object' || value === null
                                )
                                .map(([key, value]) => (
                                    <div key={key} className={styles.group}>
                                        <section className={clsx(styles.section, styles.stroke)}>
                                            <div className={styles.key}>{key}</div>
                                            <div className={styles.value}>
                                                {value === null || value === undefined 
                                                    ? 'не указано' 
                                                    : String(value)
                                                }
                                            </div>
                                        </section>
                                    </div>
                                ))}
                            
                            {/* Потом отображаем объекты (filters, pagination и т.д.) */}
                            {Object.entries(log.metadata)
                                .filter(([_, value]) => 
                                    typeof value === 'object' && value !== null
                                )
                                .map(([key, value]) => (
                                    <div key={key} className={styles.group}>
                                        <div className={styles.capture}>{key}</div>
                                        {Object.entries(value).map(([subKey, subValue]) => (
                                            <section key={subKey} className={clsx(styles.section, styles.stroke)}>
                                                <div className={styles.key}>{subKey}</div>
                                                <div className={styles.value}>
                                                    {subValue === null || subValue === undefined 
                                                        ? 'не указано' 
                                                        : String(subValue)
                                                    }
                                                </div>
                                            </section>
                                        ))}
                                    </div>
                                ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}