'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Arrow from '@/assets/ui-kit/icons/arrow';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import { arrowVariants, captureVariants, circleVariants, containerVariants, linkVariants, textItemVariants } from './_animations';

export function SimpleUiBlock({className}: PageBlockProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        amount: 0.3,
        margin: "0px 0px -100px 0px"
    });

    return (
        <motion.div 
            ref={ref}
            className={clsx(styles.block, className)}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <div className={styles.info}>
                <motion.div 
                    className={styles.capture}
                    variants={captureVariants}
                >
                    Понятный <ModalTooltip content='Кроме вашей бабушки - но и она быстро привыкнет.'>
                        <span className={styles.accent}>каждому</span>
                    </ModalTooltip> интерфейс.
                </motion.div>
                
                <motion.div 
                    className={styles.description}
                    variants={textItemVariants}
                >
                    Интерфейс Kroncl соответствует качеству нашего серверного кода - сверхбыстро, отзывчиво и понятно.
                    <br />
                    Мы помогаем сотруднику на каждом этапе - от создания сделки до получения финансового отчета за прошедший месяц.
                </motion.div>
                
                <motion.div
                    variants={linkVariants}
                >
                    <Link href='/overview' className={styles.link}>
                        <span className={styles.text}>Как это выглядит?</span>
                        <motion.span 
                            className={styles.icon}
                            variants={arrowVariants}
                            whileHover="hover"
                        >
                            <Arrow />
                        </motion.span>
                    </Link>
                </motion.div>
            </div>
            
            {/* Анимированные круги */}
            <motion.span 
                className={styles.circle}
                variants={circleVariants}
                custom={{ index: 0 }}
            />
            <motion.span 
                className={styles.circle}
                variants={circleVariants}
                custom={{ index: 1 }}
            />
        </motion.div>
    )
}