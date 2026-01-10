'use client';

import { LogoText } from '@/assets/ui-kit/logo/text/text';
import styles from './slide.module.scss';
import Link from 'next/link';
import Arrow from '@/assets/ui-kit/icons/arrow';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function HowSlide() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

    // Варианты анимации
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0,
            y: 20 
        },
        visible: { 
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const linkVariants = {
        hidden: { 
            opacity: 0,
            x: -20 
        },
        visible: { 
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "backOut"
            }
        }
    };

    const indicatorVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.8,
            rotate: -90 
        },
        visible: { 
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.3,
                ease: "backOut"
            }
        },
        hover: {
            x: 5,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    const descriptionVariants = {
        hidden: { 
            opacity: 0 
        },
        visible: { 
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            className={styles.slide}
            ref={sectionRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
        >
            <div className={styles.focus}>
                <div className={styles.col}>
                    <motion.div variants={linkVariants}>
                        <Link 
                            href='/guide/rbac' 
                            className={styles.topic}
                        >
                            <span className={styles.marker}></span>
                            <span className={styles.text}>Больше о <LogoText /></span>
                            <motion.span 
                                className={styles.indicator}
                                variants={indicatorVariants}
                                whileHover="hover"
                            >
                                <Arrow className={styles.svg} />
                            </motion.span>
                        </Link>
                    </motion.div>
                    
                    <motion.div 
                        className={styles.capture}
                        variants={itemVariants}
                    >
                        <span className={styles.brand}>Как</span> это возможно?
                    </motion.div>
                    
                    <motion.div 
                        className={styles.description}
                        variants={descriptionVariants}
                    >
                        <LogoText /> - это система из ядра и модулей. Модули, в их числе CRM, HRM, WM определяют универсальную бизнес-логику, присущую
                        80% отраслей малого и среднего бизнеса. Однако каждый из этих модулей может быть кастомизирован с помощью специальных 
                        пакетов-пресетов, распространяемых бесплатно с помощью пакетного менеджера Yieldaa! Packages.<br /><br />
                        В основе ядра <LogoText /> высокопроизводительный динамический Runtime, способный за считанные секунды 
                        применять для выбранной организации пакет, описывающий специфичные сущности с помощью конфигураций yml.
                    </motion.div>
                </div>
                <div className={styles.col}>
                    {/* Тут можно добавить дополнительные анимированные элементы */}
                </div>
            </div>
        </motion.div>
    );
}