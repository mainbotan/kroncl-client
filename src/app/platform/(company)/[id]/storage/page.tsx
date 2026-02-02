'use client';

import { PlatformHead } from "@/app/platform/components/lib/head/head";
import { useStorage } from "@/apps/company/modules";
import { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Spinner from "@/assets/ui-kit/spinner/spinner";
import { ModalTooltip } from "@/app/components/tooltip/tooltip";
import { motion } from 'framer-motion';
import { containerVariants, progressBarVariants, statItemVariants } from "./_animations";

export default function StoragePage() {
    const storage = useStorage();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    // Условный лимит хранилища (например, 100 MB)
    const STORAGE_LIMIT_MB = 1;
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        setLoading(true);
        try {
            const response = await storage.getSources();
            if (response.status) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error loading storage sources:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div style={{
            display: "flex",
            flex: "1",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%"
        }}>
        <Spinner />
    </div>;
    
    // Рассчитываем процент использования для бара
    const storageUsagePercent = data && data.total_size_mb ? 
        Math.min(100, Math.round((data.total_size_mb / STORAGE_LIMIT_MB) * 100)) : 0;
    
    return (
        <>
        <PlatformHead
           title='Ресурсы хранилища'
           description="Системная информация о ресурсах хранилища организации."
        />
        <div className={styles.head}>
            <motion.div 
                className={styles.stats}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Общий размер хранилища */}
                <ModalTooltip
                    content={'Общий размер всех объектов базы данных в схемах вашей организации'}
                >
                    <motion.section 
                        className={styles.stat}
                        variants={statItemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className={styles.value}>{data?.total_size_pretty || '0 KB'}</div>
                        <div className={styles.name}>Общий размер</div>
                    </motion.section>
                </ModalTooltip>
                
                {/* Размер таблиц */}
                <ModalTooltip
                    content={'Объём данных в таблицах (без индексов и TOAST)'}
                >
                    <motion.section 
                        className={styles.stat}
                        variants={statItemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className={styles.value}>{data?.table_size_mb ? `${data.table_size_mb.toFixed(2)} MB` : '0 MB'}</div>
                        <div className={styles.name}>Таблицы</div>
                    </motion.section>
                </ModalTooltip>
                
                {/* Размер индексов */}
                <ModalTooltip
                    content={'Размер индексов базы данных'}
                >
                    <motion.section 
                        className={styles.stat}
                        variants={statItemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className={styles.value}>{data?.index_size_mb ? `${data.index_size_mb.toFixed(2)} MB` : '0 MB'}</div>
                        <div className={styles.name}>Индексы</div>
                    </motion.section>
                </ModalTooltip>
                
                {/* Количество таблиц */}
                <ModalTooltip
                    content={'Общее количество таблиц в схемах'}
                >
                    <motion.section 
                        className={styles.stat}
                        variants={statItemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className={styles.value}>{data?.table_count || 0}</div>
                        <div className={styles.name}>Таблиц</div>
                    </motion.section>
                </ModalTooltip>
                
                {/* Количество строк */}
                <ModalTooltip
                    content={'Общее количество строк во всех таблицах'}
                >
                    <motion.section 
                        className={styles.stat}
                        variants={statItemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className={styles.value}>{data?.total_rows || 0}</div>
                        <div className={styles.name}>Строк</div>
                    </motion.section>
                </ModalTooltip>
                
                {/* Активные подключения */}
                <ModalTooltip
                    content={'Активные подключения к базе данных'}
                >
                    <motion.section 
                        className={styles.stat}
                        variants={statItemVariants}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className={styles.value}>{data?.active_connections || 0}</div>
                        <div className={styles.name}>Подключений</div>
                    </motion.section>
                </ModalTooltip>
            </motion.div>
            
            <div className={styles.bar}>
                <span
                    className={styles.line}
                    style={{
                        width: `${storageUsagePercent}%`
                    }}
                />
            </div>
        </div>
        </>
    );
}