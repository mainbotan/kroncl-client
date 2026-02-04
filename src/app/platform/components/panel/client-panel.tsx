'use client';

import clsx from 'clsx';
import styles from './panel.module.scss';
import React, { ComponentType, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CompanySection, PanelAction, PanelSection } from './_types';
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
import Clients from '@/assets/ui-kit/icons/clients';
import Wallet from '@/assets/ui-kit/icons/wallet';
import Team from '@/assets/ui-kit/icons/team';
import TwoCards from '@/assets/ui-kit/icons/two-cards';
import Warehouse from '@/assets/ui-kit/icons/warehouse';
import Branching from '@/assets/ui-kit/icons/branching';
import Deal from '@/assets/ui-kit/icons/deal';
import Kanban from '@/assets/ui-kit/icons/kanban';
import { ModalTooltip } from '@/app/components/tooltip/tooltip';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';

interface PlatformPanelProps {
  className?: string;
  title?: string;
  sections?: PanelSection[];
  companies?: CompanySection[];
  initialCollapsed?: boolean;
  actions?: PanelAction[];
  children?: React.ReactNode;
}

const iconComponents: Record<string, ComponentType<{ className?: string }>> = {
  'account': Account,
  'collection': Collection,
  'keyhole': Keyhole,
  'history': History,
  'bell': Bell,
  'settings': SettingsIcon,
  'collapse-left': CollapseLeft,
  'storage': Upload,
  'clients': Clients,
  'wallet': Wallet,
  'team': Team,
  'services': TwoCards,
  'warehouse': Warehouse,
  'logistic': Branching,
  'deals': Kanban,
  'accesses': Keyhole,
  'activity': History 
};

export default function ClientPanel({
  className,
  title = 'Ваш аккаунт',
  sections = [],
  companies = [],
  initialCollapsed = false,
  actions = [],
  children = ''
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

              return displayCollapsed ? (
                  <ModalTooltip
                      content={section.name}
                      side='right'
                      compact
                      key={index}
                  >
                    <a 
                      key={index} 
                      href={section.href}
                      className={clsx(
                        styles.section, 
                        isActive && styles.active
                      )}
                    >
                      <span className={styles.icon}>
                        {renderIcon(section.icon)}
                      </span>
                      {!displayCollapsed && (
                        <span className={styles.name}>{section.name}</span>
                      )}
                    </a>
                  </ModalTooltip>
              ) : (
                  <a 
                    key={index} 
                    href={section.href}
                    className={clsx(
                      styles.section, 
                      isActive && styles.active
                    )}
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

        {children}

        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, index) => {
              return (
                <ModalTooltip
                  content={action.label}
                  side='right'
                  compact
                  key={index}
                >
                  {action.href ? (
                  <Link href={action.href}>
                    <Button
                      className={clsx(styles.action, action.className)}
                      variant={action.variant || 'default'}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  </Link>
                  ) : (
                    <Button
                      className={clsx(styles.action, action.className)}
                      variant={action.variant || 'default'}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  )}
                </ModalTooltip>
              );
            })}
          </div>
        )}
      </div>
      
      <div className={styles.foot}>
        <div className={styles.sections}>
          {staticFootSections.map((section, index) => displayCollapsed ? (
            <ModalTooltip
              content={section.name}
              side='right'
              compact
              key={index}
            >
            <a 
              key={index}
              href={section.href}
              className={styles.section}
            >
              <span className={styles.icon}>
                {renderIcon(section.icon)}
              </span>
              {!displayCollapsed && (
                <span className={styles.name}>{section.name}</span>
              )}
            </a></ModalTooltip>
          ) : (
            <a 
              key={index}
              href={section.href}
              className={styles.section}
            >
              <span className={styles.icon}>
                {renderIcon(section.icon)}
              </span>
              {!displayCollapsed && (
                <span className={styles.name}>{section.name}</span>
              )}
            </a>
          ))}

          <ModalTooltip
            content={displayCollapsed ? "Развернуть меню" : "Свернуть меню"}
            side='right'
            compact
          >
          <section
            className={clsx(styles.section, styles.collapseBtn)}
            onClick={toggleCollapse}
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
          </ModalTooltip>
        </div>
      </div>
    </div>
  );
}