'use client';

import { PageBlockProps } from '@/app/(external)/_types';
import styles from './block.module.scss';
import clsx from 'clsx';
import { motion, useInView, useSpring, useTransform, animate, Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { containerVariants, itemVariants } from './_animations';

function AnimatedNumber({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const spring = useSpring(value, {
        mass: 1,
        stiffness: 100,
        damping: 20
    });
    const display = useTransform(spring, (current) =>
        Math.round(current).toString()
    );

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span ref={ref}>{display}</motion.span>;
}

export function TimeSavingBlock({className}: PageBlockProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isInView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [isInView, hasAnimated]);

    return (
        <motion.div 
            ref={ref}
            className={clsx(styles.block, className)}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <motion.div 
                className={styles.counter}
                variants={itemVariants}
            >
                <div className={styles.value}>
                    {hasAnimated ? <AnimatedNumber value={15} /> : 0}ч 
                    <span className={styles.secondary}>/неделя</span>
                </div>
                <div className={styles.legend}>
                    экономия времени менеджера
                </div>
            </motion.div>

            <motion.div 
                className={styles.counter}
                variants={itemVariants}
            >
                <div className={styles.value}>
                    {hasAnimated ? <AnimatedNumber value={24} /> : 0}%
                </div>
                <div className={styles.legend}>
                    снижение когнитивной нагрузки
                </div>
            </motion.div>

            <motion.div 
                className={styles.description}
                variants={itemVariants}
            >
                Не теряйте время сотрудников на сотни однотипных действий в старинных интерфейсах учётных систем.
            </motion.div>
        </motion.div>
    )
}