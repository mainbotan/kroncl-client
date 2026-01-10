'use client';

import { motion, useInView } from 'framer-motion';
import { act, useRef } from 'react';
import styles from './page.module.scss';
import Button from '@/assets/ui-kit/button/button';

export default function Content() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.1 });

    return (
        <div className={styles.container} ref={containerRef}>
            {/* Заголовок */}
            <motion.div 
                className={styles.head}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.info}>
                    <div className={styles.name}>Автосервис РФ</div>
                </div>
                <div className={styles.actions}>
                    <Button className={styles.action} variant='accent'>Создать организацию</Button>
                    <Button className={styles.action} variant='glass'>Применить</Button>
                </div>
            </motion.div>

            {/* Статистика */}
            <div className={styles.stat}>
                <motion.section 
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                >
                    <div className={styles.value}>134</div>
                    <div className={styles.capture}>Схемы</div>
                </motion.section>

                <motion.section 
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                >
                    <div className={styles.value}>21 390</div>
                    <div className={styles.capture}>Справочника</div>
                </motion.section>

                <motion.section 
                    className={styles.section}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                >
                    <div className={styles.value}>1.0.0</div>
                    <div className={styles.capture}>Актуальная версия</div>
                </motion.section>
            </div>

            {/* Описание */}
            <motion.div 
                className={styles.body}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <div className={styles.capture}>Что в составе?</div>
                <div className={styles.description}>
                    SaaS solutions are often offered in a tiered model where tenants will have access to different experiences. Performance can often be an area that is used to differentiate tiers of a SaaS environment, using performance as a way to create a value boundary that would compel tenants to move to higher level tiers.
                    <br /><br />
                    In this model, your architecture will introduce constructs that will monitor and control the experience of each tier. This isn't just about maximizing performance—it's also about limiting the consumption of lower tiered tenants. Even if your system could accommodate the load of these tenants, you might choose to limit this load purely based on cost or business considerations. This is often part of ensuring that the cost footprint of a tenant correlates with the revenue that tenant contributes to the business.
                </div>
            </motion.div>
        </div>
    );
}