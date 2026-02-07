'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export function DynamicsBlock({className}: PageBlockProps) {
    const paths = [
        // Эта линия уже идет снизу вверх: M79,226 → 491,0 ✓
        "M79.0524 226.173C199.386 224.173 450.252 176.173 491.052 0.172646",
        
        // Эта линия идет сверху вниз: M491,0 → 0,226 ✗
        // Переворачиваем: M0,226 → 491,0 ✓
        "M0.0523987 226.173C142.386 211.173 439.852 144.973 491.052 0.172646",
        
        // Эта линия идет сверху вниз: M491,0 → 156,226 ✗  
        // Переворачиваем: M156,226 → 491,0 ✓
        "M156.052 226.173C252.719 228.173 455.052 185.773 491.052 0.172646",
        
        // Эта линия идет сверху вниз: M491,0 → 283,226 ✗
        // Переворачиваем: M283,226 → 491,0 ✓
        "M283.052 226.173C343.719 221.506 470.252 169.773 491.052 0.172646",
        
        // Эта линия идет сверху вниз: M491,0 → 48,226 ✗
        // Переворачиваем: M48,226 → 491,0 ✓
        "M48.0524 226.173C169.719 221.506 428.652 169.773 491.052 0.172646"
    ];

    const colors = [
        "var(--color-purple)",
        "var(--color-orange)",
        "var(--color-green)", 
        "var(--color-red)",
        "var(--color-blue)"
    ];

    // Определяем направление для каждой линии
    // Смотрим на первую координату M (начало) и последнюю координату (конец)
    const getDirection = (path: string) => {
        // Извлекаем начальную координату M
        const mMatch = path.match(/M([\d.]+)\s+([\d.]+)/);
        if (!mMatch) return 'ltr';
        
        const startX = parseFloat(mMatch[1]);
        
        // Извлекаем последнюю координату (после последнего пробела)
        const parts = path.split(' ');
        const lastCoords = parts[parts.length - 1];
        const endX = parseFloat(lastCoords);
        
        return startX < endX ? 'ltr' : 'rtl';
    };

    // Варианты анимации для каждой линии
    const lineVariants = {
        hidden: (i: number) => {
            const direction = getDirection(paths[i]);
            return {
                pathLength: direction === 'ltr' ? 0 : 0, // Все начинают с 0
                opacity: 0.3 // Немного видим даже в скрытом состоянии
            };
        },
        visible: (i: number) => {
            const direction = getDirection(paths[i]);
            return {
                pathLength: 1, // Все доходят до полной длины
                opacity: 1,
                transition: {
                    pathLength: {
                        duration: 1,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    },
                    opacity: {
                        duration: 2,
                        delay: i * 0.2
                    }
                }
            };
        }
    };

    return (
        <motion.div 
            className={clsx(styles.block, className)}
            whileHover="visible"
            initial="hidden"
        >
            <div className={styles.canvas}>
                <svg viewBox="0 0 492 227" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            </div>
        </motion.div>
    )
}