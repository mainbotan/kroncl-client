'use client';

import clsx from 'clsx';
import styles from './panel.module.scss';
import { ComponentType, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CompanySection, PanelSection } from './_types';
import { isSectionActive } from '@/assets/utils/sections';
import CollapseLeft from '@/assets/ui-kit/icons/collapse-left';

// Импортируем все иконки на клиенте
import SettingsIcon from '@/assets/ui-kit/icons/settings';
import Account from "@/assets/ui-kit/icons/account";
import Collection from "@/assets/ui-kit/icons/collection";
import Keyhole from "@/assets/ui-kit/icons/keyhole";
import History from "@/assets/ui-kit/icons/history";
import Bell from "@/assets/ui-kit/icons/bell";
import Upload from '@/assets/ui-kit/icons/upload';

interface PlatformPanelProps {
  className?: string;
  title?: string;
  sections?: PanelSection[];
  companies?: CompanySection[];
  initialCollapsed?: boolean;
}

const iconComponents: Record<string, ComponentType<{ className?: string }>> = {
  'account': Account,
  'collection': Collection,
  'keyhole': Keyhole,
  'history': History,
  'bell': Bell,
  'settings': SettingsIcon,
  'collapse-left': CollapseLeft,
  'storage': Upload
};

export default function ClientPanel({
  className,
  title = 'Ваш аккаунт',
  sections = [],
  companies = [],
  initialCollapsed = false,
}: Readonly<PlatformPanelProps>) {
  const pathname = usePathname();
  
  // ВАЖНО: используем ТОЛЬКО initialCollapsed с сервера для SSR
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isMounted, setIsMounted] = useState(false);

  // После монтирования проверяем localStorage и синхронизируем
  useEffect(() => {
    setIsMounted(true);
    
    // Читаем из localStorage только после монтирования
    const savedState = localStorage.getItem('panel-collapsed');
    if (savedState !== null) {
      const localStorageCollapsed = JSON.parse(savedState);
      
      // Если состояние отличается от серверного, обновляем
      if (localStorageCollapsed !== initialCollapsed) {
        setIsCollapsed(localStorageCollapsed);
      }
    }
  }, [initialCollapsed]);

  // Сохраняем изменения в localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('panel-collapsed', JSON.stringify(newState));
  };

  // Сохраняем при изменении (на всякий случай)
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('panel-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isMounted]);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = iconComponents[iconName];
    if (!IconComponent) return null;
    return <IconComponent className={styles.svg} />;
  };

  const staticFootSections: PanelSection[] = [
    {
      name: 'Настройки',
      href: '/settings',
      icon: 'settings'
    }
  ];

  // Добавляем title только после монтирования, чтобы избежать mismatch
  const shouldShowTitle = isMounted ? (title && !isCollapsed) : (title && !initialCollapsed);
  const shouldShowCompany = isMounted ? (companies.length > 0 && !isCollapsed) : (companies.length > 0 && !initialCollapsed);
  const displayCollapsed = isMounted ? isCollapsed : initialCollapsed;

  return (
    <div 
      className={clsx(
        styles.panel, 
        displayCollapsed && styles.compact,
        className
      )}
    >
      <div className={styles.head}></div>
      <div className={styles.scroll}>
        {sections.length > 0 && (
          <div className={styles.sections}>
            {shouldShowTitle && (
              <section className={styles.capture}>{title}</section>
            )}
            {sections.map((section, index) => {
              const isActive = isSectionActive(pathname, {
                href: section.href,
                exact: section.exact
              });
              
              return (
                <a 
                  key={index} 
                  href={section.href}
                  className={clsx(
                    styles.section, 
                    isActive && styles.active
                  )}
                  title={displayCollapsed ? section.name : undefined}
                >
                  <span className={styles.icon}>
                    {renderIcon(section.icon)}
                  </span>
                  {!displayCollapsed && (
                    <span className={styles.name}>{section.name}</span>
                  )}
                </a>
              );
            })}
          </div>
        )}
        
        {shouldShowCompany && (
          <div className={styles.companies}>
            {companies.map((company, index) => (
              <a 
                key={index}
                href={company.href || '#'}
                className={styles.company}
              >
                <span className={styles.icon}>
                  {company.avatar ? (
                    <img 
                      src={company.avatar} 
                      alt={company.name} 
                      className={styles.avatar}
                    />
                  ) : company.icon ? (
                    renderIcon(company.icon)
                  ) : (
                    <span className={styles.avatar} />
                  )}
                </span>
                {!displayCollapsed && (
                  <span className={styles.name}>{company.name}</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.foot}>
        <div className={styles.sections}>
          {staticFootSections.map((section, index) => (
            <a 
              key={index}
              href={section.href}
              className={styles.section}
              title={displayCollapsed ? section.name : undefined}
            >
              <span className={styles.icon}>
                {renderIcon(section.icon)}
              </span>
              {!displayCollapsed && (
                <span className={styles.name}>{section.name}</span>
              )}
            </a>
          ))}

          <section
            className={clsx(styles.section, styles.collapseBtn)}
            onClick={toggleCollapse}
            title={displayCollapsed ? "Развернуть меню" : "Свернуть меню"}
          >
            <span className={styles.icon}>
              <CollapseLeft className={clsx(
                styles.svg,
                styles.collapseIcon,
                displayCollapsed && styles.rotated
              )} />
            </span>
            {!displayCollapsed && (
              <span className={styles.name}>
                Компактное меню
              </span>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}