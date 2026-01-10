'use client';

import { motion, useInView, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { LogoText } from '@/assets/ui-kit/logo/text/text';
import styles from './slide.module.scss';
import Link from 'next/link';
import Arrow from '@/assets/ui-kit/icons/arrow';

export function ProfitabilitySlide() {
  const containerRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(containerRef, { 
    amount: 0.3,
  });

  // Варианты анимации
  const containerVariants = {
    hidden: { 
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      transition: {
        duration: 0.3
      }
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

  const blockVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.3
      }
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "backOut"
      }
    })
  };

  // Отслеживаем изменение видимости
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <div className={styles.slide} ref={containerRef}>
      <motion.div 
        className={styles.focus}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className={styles.col}>
          {/* Используем motion для Link напрямую */}
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
              <span className={styles.text}>Финансовые отчёты</span>
              <span className={styles.indicator}>
                <Arrow className={styles.svg} />
              </span>
            </Link>
          </motion.div>
          
          <motion.div 
            className={styles.capture} 
            variants={itemVariants}
          >
            Рентабельность.<br />
            <span className={styles.brand}>Здесь</span> и <span className={styles.brand}>сейчас.</span>
          </motion.div>
          
          <motion.div 
            className={styles.description} 
            variants={itemVariants}
          >
            <LogoText /> способна мгновенно расчитывать действительную рентабельность дела в данный момент времени
            на основании продаж, состояния склада, затрат на сотрудников и множества других факторов.
          </motion.div>
        </div>

        <div className={styles.col}>
          {[...Array(4)].map((_, index) => (
            <motion.div 
              key={index}
              className={styles.block}
              variants={blockVariants}
              custom={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}