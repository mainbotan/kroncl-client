'use client';

import clsx from 'clsx';
import styles from './head.module.scss';
import Input from '@/assets/ui-kit/input/input';
import Search from '@/assets/ui-kit/icons/search';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { isSectionActive } from '@/assets/utils/sections';
import { PlatformHeadProps } from './_types';

export function PlatformHead({
  title,
  description,
  actions = [],
  sections = [],
  currentPath,
  showSearch = false,
  notes = []
}: PlatformHeadProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePath = currentPath || pathname || '';

  // Определяем активный раздел с учетом query параметров
  const getActiveSectionValue = () => {
    if (!sections.length) return '';
    
    // Получаем текущий параметр role
    const currentRole = searchParams.get('role');
    
    // Определяем активную секцию по параметру role
    if (currentRole === 'owner') {
      return 'owner';
    } else if (currentRole === 'guest') {
      return 'joined'; // или 'guest', смотря какое value у секции
    } else {
      return 'all';
    }
  };

  const activeSectionValue = getActiveSectionValue();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.info}>
          <div className={styles.capture}>{title}</div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
        
        {actions.length > 0 && (
          <div className={styles.actions}>
            {actions.map((action, index) => {
              const button = (
                <Button
                  key={index}
                  className={clsx(styles.action, action.className)}
                  variant={action.variant || 'contrast'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              );

              return action.href ? (
                <Link key={index} href={action.href} className={clsx(styles.action, action.className)}>
                  {button}
                </Link>
              ) : button;
            })}
          </div>
        )}
      </div>

      {sections.length > 0 && (
        <div className={styles.sections}>
          <div className={styles.grid}>
            {sections.map((section) => {
              const isActive = section.value === activeSectionValue;
              const sectionContent = (
                <span
                  className={clsx(
                    styles.section,
                    isActive && styles.active,
                    section.disabled && styles.disabled
                  )}
                  data-value={section.value}
                >
                  {section.label}
                  {section.badge !== undefined && section.badge > 0 && (
                    <span className={styles.badge}>{section.badge}</span>
                  )}
                </span>
              );

              return section.href && !section.disabled ? (
                <Link
                  key={section.value}
                  href={section.href}
                  className={styles.sectionLink}
                >
                  {sectionContent}
                </Link>
              ) : (
                <div key={section.value} className={styles.sectionLink}>
                  {sectionContent}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showSearch && (
        <div className={styles.search}>
          <Input 
            type='text' 
            className={styles.input} 
            variant='glass' 
            placeholder="Поиск..."
          />
          <Button className={styles.button} variant='accent'>
            Искать
          </Button>
        </div>
      )}

      {notes.length > 0 && (
        <div className={styles.notes}>
          {notes.map((note, index) => (
            <div 
              key={index} 
              className={clsx(styles.note, styles[note.type])}
            >
              <div className={styles.capture}>{note.title}</div>
              <div className={styles.description}>{note.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}