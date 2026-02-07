'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

export function DynamicsBlock({className}: PageBlockProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false, // Можно поставить true если нужно только один раз
        amount: 0.3, // 30% элемента должно быть видно
        margin: "0px 0px -100px 0px" // Небольшой отступ снизу
    });

    const paths = [
        "M79.0524 226.173C199.386 224.173 450.252 176.173 491.052 0.172646",
        "M0.0523987 226.173C142.386 211.173 439.852 144.973 491.052 0.172646",
        "M156.052 226.173C252.719 228.173 455.052 185.773 491.052 0.172646",
        "M283.052 226.173C343.719 221.506 470.252 169.773 491.052 0.172646",
        "M48.0524 226.173C169.719 221.506 428.652 169.773 491.052 0.172646"
    ];

    const colors = [
        "var(--color-purple)",
        "var(--color-orange)",
        "var(--color-green)", 
        "var(--color-red)",
        "var(--color-blue)"
    ];

    // Варианты анимации для каждой линии
    // Более плавная обратная анимация
    const lineVariants: Variants = {
        hidden: { 
            pathLength: 0,
            opacity: 0.1
        },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    duration: 1.5, // Быстрее вперед
                    delay: i * 0.15, // Меньшая задержка между линиями
                    ease: "easeInOut"
                },
                opacity: {
                    duration: 0.8,
                    delay: i * 0.15
                }
            }
        }),
        exit: (i: number) => ({
            pathLength: 0,
            opacity: 0.1,
            transition: {
                pathLength: {
                    duration: 2, // Медленнее назад
                    delay: (paths.length - 1 - i) * 0.1, // Обратный порядок
                    ease: "easeInOut"
                },
                opacity: {
                    duration: 1,
                    delay: (paths.length - 1 - i) * 0.1
                }
            }
        })
    };

    return (
        <motion.div 
            ref={ref}
            className={clsx(styles.block, className)}
            initial="hidden"
            animate={isInView ? "visible" : "exit"}
        >
            <div className={styles.content}>
                <div className={styles.capture}>Повысьте эффективность учёта</div>
                <div className={styles.description}>
                    Джон Майкл «О́ззи» О́сборн — английский рок-певец, музыкант. В 1968 году он стал одним из основателей новаторской хеви-метал-группы Black Sabbath, где приобрёл прозвище «Принц тьмы».
                </div>
            </div>
            <svg className={styles.svg} viewBox="0 0 492 227" fill="none" xmlns="http://www.w3.org/2000/svg">
                {paths.map((path, index) => (
                    <motion.path
                        key={index}
                        d={path}
                        stroke={colors[index]}
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        variants={lineVariants}
                        custom={index}
                    />
                ))}
            </svg>
            <div className={styles.shadow} />
        </motion.div>
    )
}