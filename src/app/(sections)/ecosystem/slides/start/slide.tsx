'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import styles from './slide.module.scss';
import { iconConfig } from './icons.config';
import Button from '@/assets/ui-kit/button/button';
import Arrow from '@/assets/ui-kit/icons/arrow';
import Link from 'next/link';

const ROWS = 13;
const COLS = 20;

// Супер простая функция генерации сетки
function generateIconGrid() {
  const grid = [];
  
  for (let row = 0; row < ROWS; row++) {
    const rowIcons = [];
    let lastIcon = null;
    
    for (let col = 0; col < COLS; col++) {
      // Проверяем, есть ли иконки в конфиге
      if (iconConfig.length === 0) {
        rowIcons.push(null);
        continue;
      }
      
      let availableIcons = [...iconConfig];
      
      // Исключаем предыдущую иконку в строке
      if (lastIcon && availableIcons.length > 1) {
        availableIcons = availableIcons.filter(icon => icon !== lastIcon);
      }
      
      // Выбираем случайную иконку
      const randomIndex = Math.floor(Math.random() * availableIcons.length);
      const chosenIcon = availableIcons[randomIndex];
      
      rowIcons.push(chosenIcon);
      lastIcon = chosenIcon;
    }
    
    grid.push(rowIcons);
  }
  
  return grid;
}

export function StartSlide() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Генерируем сетку один раз
  const iconGrid = useMemo(() => generateIconGrid(), []);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 720);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Базовая анимация
  const iconVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5
    },
    visible: (custom: { row: number; col: number }) => ({ 
      opacity: 1,
      scale: 1,
      transition: {
        delay: custom.row * 0.08 + custom.col * 0.015,
        duration: 0.4
      }
    }),
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  // Если не замаунтился или нет иконок
  if (!mounted || iconConfig.length === 0) {
    return (
      <div className={styles.slide}>
        <div className={styles.gradient} />
        <div className={styles.focus}></div>
        <div className={styles.icons}>
          {/* Пустая сетка */}
          {[...Array(ROWS)].map((_, rowIndex) => (
            <div key={`line-${rowIndex}`} className={styles.line}>
              {[...Array(COLS)].map((_, colIndex) => (
                <span key={`${rowIndex}-${colIndex}`} className={styles.icon} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.slide}>
      <div className={styles.gradient} />
      <div className={styles.focus}>
        <div className={styles.col}>
            <div className={styles.capture}>
                <span className={styles.brand}>500<span>+</span></span> отраслевых пакетов <br />
                для вашего дела.
            </div>
            <div className={styles.slogan}>
                Без кода. Без интеграторов. Без настройки.
            </div>
            <div className={styles.actions}>
                <Link href='/packages'><Button className={styles.action} variant='accent'>Отраслевые решения <Arrow className={styles.svg} /></Button></Link>
            </div>
        </div>
      </div>
      
      <div className={styles.icons}>
        {iconGrid.map((rowIcons, rowIndex) => (
          <div key={`line-${rowIndex}`} className={styles.line}>
            {rowIcons.map((Icon, colIndex) => {
              if (!Icon) {
                return (
                  <span key={`${rowIndex}-${colIndex}`} className={styles.icon} />
                );
              }
              
              return isMobile ? (
                <span key={`${rowIndex}-${colIndex}`} className={styles.icon}>
                  <Icon className={styles.svg} width={20} height={20} />
                </span>
              ) : (
                <motion.span
                  key={`${rowIndex}-${colIndex}`}
                  className={styles.icon}
                  initial="hidden"
                  animate="visible"
                  variants={iconVariants}
                  custom={{ row: rowIndex, col: colIndex }}
                >
                  <Icon className={styles.svg} width={20} height={20} />
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}