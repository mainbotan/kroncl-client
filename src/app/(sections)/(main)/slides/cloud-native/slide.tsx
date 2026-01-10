'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './slide.module.scss';
import Arrow from '@/assets/ui-kit/icons/arrow';
import Cloud from '@/assets/ui-kit/icons/cloud';
import YCloud from './y-cloud';
import clsx from 'clsx';

export function CloudNativeSlide() {
  return (
    <div className={styles.slide}>
      <div className={styles.focus}>
        <div className={styles.col}>
          {/* Ссылка с анимацией */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: false }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href='/guide/rbac' 
              className={styles.topic}
            >
              <span className={styles.marker}></span>
              <span className={styles.text}>Облачная инфраструктура</span>
              <span className={styles.indicator}>
                <Arrow className={styles.svg} />
              </span>
            </Link>
          </motion.div>
          
          {/* Заголовок с анимацией */}
          <motion.div 
            className={styles.capture}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: false }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Работайте в облаке. <br />
            <motion.span 
              className={styles.brand}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2, once: false }}
              transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
            >
              Доступность 24/7.
            </motion.span>
          </motion.div>
          
          {/* Описание с анимацией */}
          <motion.div 
            className={styles.description}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2, once: false }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Облачная инфраструктура на серверах<br />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.2, once: false }}
              transition={{ duration: 0.5, delay: 0.3, ease: "backOut" }}
            >
              <YCloud className={styles.logo} color='var(--text-color-primary)' />
            </motion.div>
            <span className={styles.secondary}>
              152-ФЗ • CSA • PCI DSS • ГОСТ • ISO • GDRP
            </span> 
          </motion.div>
        </div>
      </div>
    </div>
  );
}