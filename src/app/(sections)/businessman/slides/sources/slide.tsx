'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import styles from './slide.module.scss';
import Book from '@/assets/ui-kit/icons/book';
import PiggyBank from '@/assets/ui-kit/icons/piggy-bank';
import Puzzle from '@/assets/ui-kit/icons/puzzle';
import Bell from '@/assets/ui-kit/icons/bell';
import Arrow from '@/assets/ui-kit/icons/arrow';
import { useRef, useEffect, useState } from 'react';

export function SourcesSlide() {
    const gridRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const [isVisible, setIsVisible] = useState(false);

    // Запускаем анимацию через небольшой таймаут после загрузки
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleScroll = (direction: 'left' | 'right') => {
        if (!gridRef.current || !scrollContainerRef.current) return;

        const cardWidth = 12 * 16;
        const gap = 1 * 16;
        const cardWidthWithGap = cardWidth + gap;
        const scrollAmount = cardWidthWithGap * 2;

        const currentScroll = scrollContainerRef.current.scrollLeft;
        const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

        let targetScroll;
        if (direction === 'left') {
            targetScroll = Math.max(0, currentScroll - scrollAmount);
        } else {
            targetScroll = Math.min(maxScroll, currentScroll + scrollAmount);
        }

        scrollContainerRef.current.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    };

    // Анимация для карточек
    const cardVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: (index: number) => ({ 
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className={styles.slide} ref={sectionRef}>
            <div className={styles.col} ref={scrollContainerRef}>
                <div className={styles.grid} ref={gridRef}>
                    {/* Карточка 1 */}
                    <motion.div 
                        className={styles.card}
                        custom={0}
                        initial="hidden"
                        animate={isInView || isVisible ? "visible" : "hidden"}
                        variants={cardVariants}
                    >
                        <div className={styles.icon}>
                            <span className={styles.circle}>
                                <Book className={styles.svg} />
                            </span>
                        </div>
                        <div className={styles.capture}>
                            База знаний
                        </div>
                        <div className={styles.description}>
                            Здесь собрана документация всех модулей <LogoText />, с подробными пояснениями, примерами
                            использования и рекомендациями по внедрению.
                        </div>
                    </motion.div>
                    
                    {/* Карточка 2 */}
                    <motion.div 
                        className={styles.card}
                        custom={1}
                        initial="hidden"
                        animate={isInView || isVisible ? "visible" : "hidden"}
                        variants={cardVariants}
                    >
                        <div className={styles.icon}>
                            <span className={styles.circle}>
                                <PiggyBank className={styles.svg} />
                            </span>
                        </div>
                        <div className={styles.capture}>
                            Партнёрство
                        </div>
                        <div className={styles.description}>
                            Станьте партнёром и получайте бонусы за привлечение новых клиентов-организаций.
                        </div>
                    </motion.div>
                    
                    {/* Карточка 3 */}
                    <motion.div 
                        className={styles.card}
                        custom={2}
                        initial="hidden"
                        animate={isInView || isVisible ? "visible" : "hidden"}
                        variants={cardVariants}
                    >
                        <div className={styles.icon}>
                            <span className={styles.circle}>
                                <Puzzle className={styles.svg} />
                            </span>
                        </div>
                        <div className={styles.capture}>
                            Интеграции
                        </div>
                        <div className={styles.description}>
                            {/* Описание для Интеграций */}
                        </div>
                    </motion.div>
                    
                    {/* Карточка 4 */}
                    <motion.div 
                        className={styles.card}
                        custom={3}
                        initial="hidden"
                        animate={isInView || isVisible ? "visible" : "hidden"}
                        variants={cardVariants}
                    >
                        <div className={styles.icon}>
                            <span className={styles.circle}>
                                <Bell className={styles.svg} />
                            </span>
                        </div>
                        <div className={styles.capture}>
                            Уведомления об обновлениях
                        </div>
                        <div className={styles.description}>
                            {/* Описание для Уведомлений */}
                        </div>
                    </motion.div>
                    
                    {/* Карточка 5 */}
                    <motion.div 
                        className={styles.card}
                        custom={4}
                        initial="hidden"
                        animate={isInView || isVisible ? "visible" : "hidden"}
                        variants={cardVariants}
                    >
                        <div className={styles.icon}>
                            <span className={styles.circle}>
                                <Bell className={styles.svg} />
                            </span>
                        </div>
                        <div className={styles.capture}>
                            Уведомления об обновлениях
                        </div>
                        <div className={styles.description}>
                            {/* Описание для Уведомлений */}
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className={styles.col}>
                {/* Кнопки прокрутки */}
                <motion.span 
                    className={styles.circle} 
                    onClick={() => handleScroll('left')}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView || isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Arrow className={styles.svg} />
                </motion.span>
                
                <motion.span 
                    className={styles.circle} 
                    onClick={() => handleScroll('right')}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView || isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Arrow className={styles.svg} />
                </motion.span>
            </div>
        </div>
    );
}