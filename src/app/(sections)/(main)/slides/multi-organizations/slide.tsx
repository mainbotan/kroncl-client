'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import styles from './slide.module.scss';
import Link from 'next/link';
import Arrow from '@/assets/ui-kit/icons/arrow';

export function MultiOrganizationsSlide() {
  const containerRef = useRef(null);

  // Анимация для ссылки-топика
  const topicAnimation = {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { amount: 0.2, once: false },
    transition: { 
      duration: 0.5,
      delay: 0.1
    }
  };

  // Анимация появления текста
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Анимация сетки (волновой эффект)
  const getGridAnimationDelay = (index: number) => {
    const row = Math.floor(index / 7); // 7 колонок
    const col = index % 7;
    
    // Анимация "волной" из центра
    const centerX = 3; // Центральная колонка (0-6)
    const centerY = Math.floor(28 / 7 / 2); // Центральная строка
    
    const distance = Math.sqrt(
      Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2)
    );
    
    return 0.1 + distance * 0.03;
  };

  return (
    <div className={styles.slide} ref={containerRef}>
      <div className={styles.focus}>
        {/* Левая колонка */}
        <motion.div 
          className={styles.col}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2, once: false }}
          variants={textContainerVariants}
        >
          {/* Обертка для анимации Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: false }}
            transition={{ 
              duration: 0.5,
              delay: 0.1
            }}
          >
            <Link 
              href='/guide/rbac' 
              className={styles.topic}
            >
              <span className={styles.marker}></span>
              <span className={styles.text}>Подключение к организациям</span>
              <span className={styles.indicator}>
                <Arrow className={styles.svg} />
              </span>
            </Link>
          </motion.div>
          
          <motion.div 
            className={styles.capture}
            variants={textItemVariants}
          >
            <motion.span 
              className={styles.brand}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2, once: false }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Мгновенное
            </motion.span> переключение<br />
            организаций.
          </motion.div>
          
          <motion.div 
            className={styles.description}
            variants={textItemVariants}
          >
            Работайте в нескольких организациях одновременно. Для смены рабочих пространств 
            не придётся перезаходить и вспоминать учётные данные.
            <br /><br />
            <span className={styles.brand}>Одна учётная запись</span> - несколькой компаний.
          </motion.div>
        </motion.div>

        {/* Правая колонка */}
        <div className={styles.col}>
          {/* Сетка с последовательным заполнением */}
          <div className={styles.grid}>
            {[...Array(28)].map((_, index) => (
              <motion.div
                key={index}
                className={styles.block}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.1, once: false }}
                transition={{
                  duration: 0.3,
                  delay: getGridAnimationDelay(index),
                  ease: "backOut"
                }}
              />
            ))}
          </div>

          <span className={styles.shadow} />
        </div>
      </div>
    </div>
  );
}