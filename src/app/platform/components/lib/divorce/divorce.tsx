'use client';

import { ComponentType } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import styles from './divorce.module.scss';
import { DivorceSection } from './_types';
import { itemVariants, titleVariants } from './_animations';

interface PlatformDivorceProps {
  title?: string;
  description?: string;
  sections?: DivorceSection[];
}

export function PlatformDivorce({
  title = 'Добро пожаловать',
  description,
  sections = [],
}: PlatformDivorceProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className={styles.container}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {title && (
        <motion.div 
          className={styles.title} 
          variants={titleVariants}
        >
          {title}
        </motion.div>
      )}
      {description && (
        <motion.div 
          className={styles.description} 
          variants={titleVariants}
        >
          {description}
        </motion.div>
      )}
      <motion.div 
        className={styles.sections}
        variants={containerVariants}
      >
        {sections.map((section, index) => {
          const Icon = section.icon;
          const SectionContent = (
            <>
              <div className={styles.title}>
                {Icon && <Icon className={styles.svg} />}
                <span>{section.title}</span>
              </div>
              {section.description && (
                <div className={styles.description}>
                  {section.description}
                </div>
              )}
            </>
          );

          const MotionElement = section.href ? motion.a : motion.section;
          
          return (
            <MotionElement
              key={index}
              href={section.href}
              className={clsx(styles.section, section.accent && styles.accent)}
              variants={itemVariants}
              whileHover="hover"
              custom={index}
            >
              {SectionContent}
            </MotionElement>
          );
        })}
      </motion.div>
    </motion.div>
  );
}