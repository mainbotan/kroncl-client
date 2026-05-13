'use client';

import clsx from 'clsx';
import { motion, Variants } from 'framer-motion';
import styles from './warning.module.scss';
import Button from '@/assets/ui-kit/button/button';
import { useScreen } from '../provider/provider';

const containerVariants: Variants = {
    hidden: { 
        opacity: 0, 
        y: -50,
        scale: 0.95
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        y: -30,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

const contentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { delay: 0.1 }
    }
};

export interface ScreenControlWarningProps {
    className?: string;
}

export function ScreenControlWarning({ className }: ScreenControlWarningProps) {
    const { shouldShowWarning, dismissWarning } = useScreen();

    if (!shouldShowWarning) return null;

    return (
        <motion.div
            className={clsx(styles.container, className)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <motion.div 
                className={styles.info}
                variants={contentVariants}
            >
                Для удобства работы рекомендуем переключиться на экран с большим разрешением (десктоп)
            </motion.div>
            <motion.div 
                className={styles.actions}
                variants={contentVariants}
            >
                <Button
                    children='Остаться'
                    variant='contrast'
                    className={styles.action}
                    onClick={dismissWarning}
                />
            </motion.div>
            <motion.div 
                className={styles.postInfo}
                variants={contentVariants}
            >
                Некоторые экспериментальные функции могут быть недоступны на мобильных устройствах
            </motion.div>
        </motion.div>
    );
}