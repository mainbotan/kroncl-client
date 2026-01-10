'use client';

import { motion } from 'framer-motion';
import styles from './canvas.module.scss';
import clsx from 'clsx';
import Team from '@/assets/ui-kit/icons/team';
import TwoCards from '@/assets/ui-kit/icons/two-cards';
import Wallet from '@/assets/ui-kit/icons/wallet';
import Warehouse from '@/assets/ui-kit/icons/warehouse';
import ShoppingCart from '@/assets/ui-kit/icons/shopping-cart';
import Clients from '@/assets/ui-kit/icons/clients';
import Chart from '@/assets/ui-kit/icons/chart';
import Kanban from '@/assets/ui-kit/icons/kanban';
import Eye from '@/assets/ui-kit/icons/eye';
import Button from '@/assets/ui-kit/button/button';
import React, { useEffect, useRef, useState, useMemo } from 'react';

// Хук для определения мобильного устройства
function useIsMobile(maxWidth = 720) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= maxWidth);
    };

    // Проверяем при загрузке
    checkMobile();

    // Проверяем при изменении размера окна
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [maxWidth]);

  return isMobile;
}

// Компонент-обертка для условного рендеринга motion или обычного div
const MotionOrDiv = ({ isMobile, children, ...props }: any) => {
  if (isMobile) {
    // На мобильных рендерим обычный div, удаляя все motion пропсы
    const { initial, animate, transition, whileHover, ...divProps } = props;
    return <div {...divProps}>{children}</div>;
  }
  
  // На десктопе рендерим motion.div
  return <motion.div {...props}>{children}</motion.div>;
};

const MotionOrSpan = ({ isMobile, children, ...props }: any) => {
  if (isMobile) {
    const { initial, animate, transition, ...spanProps } = props;
    return <span {...spanProps}>{children}</span>;
  }
  
  return <motion.span {...props}>{children}</motion.span>;
};

const MotionOrSection = ({ isMobile, children, ...props }: any) => {
  if (isMobile) {
    const { initial, animate, transition, ...sectionProps } = props;
    return <section {...sectionProps}>{children}</section>;
  }
  
  return <motion.section {...props}>{children}</motion.section>;
};

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const isMobile = useIsMobile(720);
  
  const employees = [
    { name: "Евгений Дерзкий", role: "Менеджер", deals: 245, reward: "24 500 ₽" },
    { name: "Анастасия Волкова", role: "Директор", deals: 189, reward: "156 200 ₽" },
    { name: "Дмитрий Ковалёв", role: "Менеджер", deals: 312, reward: "41 800 ₽" },
    { name: "Екатерина Смирнова", role: "Бухгалтер", deals: 67, reward: "89 000 ₽" },
    { name: "Алексей Петров", role: "Руководитель отдела продаж", deals: 456, reward: "278 500 ₽" },
    { name: "Мария Иванова", role: "Менеджер", deals: 198, reward: "32 100 ₽" },
    { name: "Сергей Кузнецов", role: "Логист", deals: 134, reward: "67 400 ₽" },
    { name: "Ольга Морозова", role: "HR-менеджер", deals: 23, reward: "45 900 ₽" },
    { name: "Николай Соколов", role: "Менеджер по закупкам", deals: 289, reward: "112 700 ₽" },
    { name: "Татьяна Лебедева", role: "Финансовый аналитик", deals: 156, reward: "98 300 ₽" },
    { name: "Иван Попов", role: "Менеджер", deals: 378, reward: "56 200 ₽" },
    { name: "Елена Григорьева", role: "Специалист по клиентами", deals: 201, reward: "38 700 ₽" },
    { name: "Максим Орлов", role: "Технический специалист", deals: 89, reward: "72 100 ₽" },
    { name: "Виктория Романова", role: "Менеджер проектов", deals: 167, reward: "134 800 ₽" }
  ];

  // Отключаем Intersection Observer на мобильных
  const observerOptions = useMemo(() => {
    if (isMobile) return null;
    return {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setInView(true); // На мобильных сразу показываем контент
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, observerOptions!);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, observerOptions]);

  // Анимация для бренда
  const brandAnimation = useMemo(() => {
    if (isMobile) return {};
    return {
      initial: { opacity: 0, scale: 0.8, rotate: -10 },
      animate: inView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -10 },
      transition: { 
        duration: 0.5,
        ease: "backOut"
      }
    };
  }, [isMobile, inView]);

  // Анимация для организаций
  const orgItemAnimation = useMemo(() => (index: number) => {
    if (isMobile) return {};
    return {
      initial: { opacity: 0, x: -20, scale: 0.9 },
      animate: inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -20, scale: 0.9 },
      transition: { 
        duration: 0.4,
        delay: 0.2 + index * 0.05,
        ease: "easeOut"
      }
    };
  }, [isMobile, inView]);

  // Анимация для секций управления
  const controlItemAnimation = useMemo(() => (index: number) => {
    if (isMobile) return {};
    return {
      initial: { opacity: 0, x: -15 },
      animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 },
      transition: { 
        duration: 0.35,
        delay: 0.5 + index * 0.03,
        ease: "easeOut"
      }
    };
  }, [isMobile, inView]);

  // Анимация для элементов breadcrumbs
  const breadcrumbItemAnimation = useMemo(() => (index: number) => {
    if (isMobile) return {};
    return {
      initial: { opacity: 0, y: -10 },
      animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 },
      transition: { 
        duration: 0.3,
        delay: 0.8 + index * 0.1,
        ease: "easeOut"
      }
    };
  }, [isMobile, inView]);

  // Анимация для разделителей breadcrumbs
  const breadcrumbSeparatorAnimation = useMemo(() => (index: number) => {
    if (isMobile) return {};
    return {
      initial: { opacity: 0, scale: 0 },
      animate: inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 },
      transition: { 
        duration: 0.2,
        delay: 0.85 + index * 0.1,
        ease: "easeOut"
      }
    };
  }, [isMobile, inView]);

  // Анимация для карточек сотрудников
  const getCardAnimation = useMemo(() => (index: number) => {
    if (isMobile) return {};
    
    const row = Math.floor(index / 3);
    const col = index % 3;
    const delay = 1.0 + (col * 0.15) + (row * 0.05);
    
    return {
      initial: { 
        opacity: 0, 
        x: 30,
        scale: 0.9,
        filter: "blur(4px)"
      },
      animate: inView ? { 
        opacity: 1, 
        x: 0,
        scale: 1,
        filter: "blur(0px)"
      } : { 
        opacity: 0, 
        x: 30,
        scale: 0.9,
        filter: "blur(4px)"
      },
      transition: { 
        duration: 0.5,
        delay: delay,
        ease: "easeOut",
        filter: { duration: 0.3 }
      }
    };
  }, [isMobile, inView]);

  const buttonAnimation = useMemo(() => {
    if (isMobile) return {};
    return {
      initial: { opacity: 0, y: 10 },
      animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
      transition: { 
        duration: 0.4,
        delay: 1.3,
        ease: "easeOut"
      }
    };
  }, [isMobile, inView]);

  // Условие для whileHover на мобильных
  const getHoverProps = useMemo(() => {
    if (isMobile) return {};
    return {
      whileHover: {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }
    };
  }, [isMobile]);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Левая панель */}
      <div className={styles.panel}>
        <MotionOrSection 
          isMobile={isMobile}
          className={styles.section}
          {...brandAnimation}
        >
          <div className={styles.brand}>
            Y<span className={styles.offset}>!</span>
          </div>
        </MotionOrSection>
        
        <div className={clsx(styles.orgs)}>
          {[...Array(7)].map((_, index) => (
            <MotionOrSection 
              key={index}
              isMobile={isMobile}
              className={clsx(styles.section, index === 0 && styles.active)}
              {...orgItemAnimation(index)}
            >
              <div className={styles.icon}></div>
              <span className={styles.indicator} />
            </MotionOrSection>
          ))}
        </div>
      </div>

      {/* Левое меню */}
      <MotionOrDiv 
        isMobile={isMobile}
        className={styles.control}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 1 }}
        transition={isMobile ? undefined : { duration: 0.3, delay: 0.4 }}
      >
        <div className={styles.label}></div>
        <div className={styles.sections}>
          <div className={styles.group}>Управление</div>
          
          {[
            { icon: Kanban, text: "Сделки", count: "924", active: false },
            { icon: Chart, text: "Аналитика", count: null, active: false },
            { icon: Team, text: "Сотрудники", count: "14", active: true },
            { icon: Wallet, text: "Финансы", count: null, active: false },
            { icon: Warehouse, text: "Склад", count: null, active: false },
            { icon: Clients, text: "Клиенты", count: "464", active: false },
            { icon: TwoCards, text: "Ассортимент услуг", count: null, active: false },
            { icon: ShoppingCart, text: "Закупки", count: null, active: false },
          ].map((item, index) => (
            <MotionOrDiv 
              key={index}
              isMobile={isMobile}
              className={clsx(styles.section, item.active && styles.active)}
              {...controlItemAnimation(index)}
            >
              <div className={styles.icon}>
                <item.icon className={styles.svg} />
              </div>
              <div className={styles.name}>
                <span className={styles.span}>{item.text}</span>
              </div>
              {item.count && (
                <div className={styles._meta}>
                  <span className={styles.count}>{item.count}</span>
                </div>
              )}
            </MotionOrDiv>
          ))}
        </div>
      </MotionOrDiv>

      {/* Основная область */}
      <div className={styles.area}>
        <MotionOrDiv 
          isMobile={isMobile}
          className={styles.head}
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={isMobile ? undefined : { duration: 0.4, delay: 0.7 }}
        >
          <span className={styles.breadcrumbs}>
            <MotionOrSpan 
              isMobile={isMobile}
              className={styles.point}
              {...breadcrumbItemAnimation(0)}
            >
              <div className={styles.name}>ООО КупиПродай</div>
            </MotionOrSpan>
            
            <MotionOrSpan 
              isMobile={isMobile}
              className={styles.inter}
              {...breadcrumbSeparatorAnimation(0)}
            >
              /
            </MotionOrSpan>
            
            <MotionOrSpan 
              isMobile={isMobile}
              className={styles.point}
              {...breadcrumbItemAnimation(1)}
            >
              <span className={styles.icon}>
                <Team className={styles.svg} />
              </span>
              <div className={styles.name}>Сотрудники</div>
            </MotionOrSpan>
            
            <MotionOrSpan 
              isMobile={isMobile}
              className={styles.inter}
              {...breadcrumbSeparatorAnimation(1)}
            >
              /
            </MotionOrSpan>
            
            <MotionOrSpan 
              isMobile={isMobile}
              className={clsx(styles.point, styles.active)}
              {...breadcrumbItemAnimation(2)}
            >
              <span className={styles.icon}>
                <Eye className={styles.svg} />
              </span>
              <div className={styles.name}>Просмотр</div>
            </MotionOrSpan>
          </span>

          {/* Кнопки действий */}
          <MotionOrSpan 
            isMobile={isMobile}
            className={styles.actions}
            {...buttonAnimation}
          >
            <Button className={styles.action} variant='accent'>Пригласить</Button>
            <Button className={styles.action} variant='default'>Создать вручную</Button>
          </MotionOrSpan>
        </MotionOrDiv>

        {/* Сетка сотрудников */}
        <div className={styles.content}>
          <div className={styles.grid}>
            {employees.map((employee, index) => (
              <MotionOrDiv
                key={index}
                isMobile={isMobile}
                className={styles.card}
                {...getCardAnimation(index)}
                {...getHoverProps}
              >
                <div className={styles.top}>
                  <span className={styles.name}>{employee.name}</span>
                  <span className={styles.actions}>
                    <span className={styles.action}>
                      <Chart className={styles.svg} />
                    </span>
                  </span>
                </div>
                <div className={styles.info}>
                  <div className={styles.avatar}>
                    <MotionOrDiv 
                      isMobile={isMobile}
                      className={styles.circle} 
                      style={{
                        background: `linear-gradient(135deg, hsl(${Math.random()*360}, 70%, 65%), hsl(${Math.random()*360}, 70%, 55%))`
                      }}
                      initial={isMobile ? undefined : { scale: 0 }}
                      animate={isMobile ? undefined : (inView ? { scale: 1 } : { scale: 0 })}
                      transition={isMobile ? undefined : { 
                        duration: 0.4,
                        delay: 1.0 + index * 0.02,
                        ease: "backOut"
                      }}
                    />
                  </div>
                  <div className={styles.chars}>
                    {[
                      { label: "Роль", value: employee.role },
                      { label: "Участие в сделках", value: employee.deals },
                      { label: "Вознаграждения", value: employee.reward }
                    ].map((char, charIndex) => (
                      <MotionOrDiv 
                        key={charIndex}
                        isMobile={isMobile}
                        className={styles.line}
                        initial={isMobile ? undefined : { opacity: 0, x: 10 }}
                        animate={isMobile ? undefined : (inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 })}
                        transition={isMobile ? undefined : { 
                          duration: 0.3,
                          delay: 1.1 + (index * 0.03) + (charIndex * 0.05)
                        }}
                      >
                        <span className={styles.name}>{char.label}</span>
                        <span className={styles.value}>{char.value}</span>
                      </MotionOrDiv>
                    ))}
                  </div>
                </div>
                <MotionOrDiv 
                  isMobile={isMobile}
                  className={styles.actions}
                  initial={isMobile ? undefined : { opacity: 0 }}
                  animate={isMobile ? undefined : (inView ? { opacity: 1 } : { opacity: 0 })}
                  transition={isMobile ? undefined : { 
                    duration: 0.3,
                    delay: 1.2 + index * 0.02
                  }}
                >
                  <Button className={styles.action} variant='contrast'>Редактировать</Button>
                  <Button className={styles.action} variant='default'>Отчёт</Button>
                </MotionOrDiv>
              </MotionOrDiv>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}