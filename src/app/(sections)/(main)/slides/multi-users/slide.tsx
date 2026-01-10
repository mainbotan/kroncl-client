'use client';

import { motion } from 'framer-motion';
import Arrow from '@/assets/ui-kit/icons/arrow';
import styles from './slide.module.scss';
import Link from 'next/link';
import { Canvas } from './canvas/canvas';

export function MultiUsersSlide() {
  // Анимация для левой колонки
  const leftColumnAnimation = {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { amount: 0.2, once: false },
    transition: { 
      duration: 0.7,
      ease: "easeOut"
    }
  };

  // Анимация для заголовка
  const captureAnimation = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { amount: 0.2, once: false },
    transition: { 
      duration: 0.6,
      delay: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  };

  return (
    <div className={styles.slide}>
      <div className={styles.focus}>
        {/* Левая колонка */}
        <motion.div 
          className={styles.col}
          {...leftColumnAnimation}
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
              <span className={styles.text}>Разделение доступов</span>
              <span className={styles.indicator}>
                <Arrow className={styles.svg} />
              </span>
            </Link>
          </motion.div>
          
          <motion.div 
            className={styles.capture}
            {...captureAnimation}
          >
            Приглашайте сотрудников.<br />
            <motion.span 
              className={styles.brand}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2, once: false }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                ease: "backOut"
              }}
            >
              Без лимитов и доплат.
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Правая колонка с Canvas */}
        <motion.div 
          className={styles.col}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.1, once: false }}
          transition={{ 
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut"
          }}
        >
          <div className={styles.canvas}>
            <Canvas />
            <motion.span 
              className={styles.shadow}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2, once: false }}
              transition={{ 
                duration: 0.6,
                delay: 0.8,
                ease: "easeOut"
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}