'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import styles from './head.module.scss';
import Input from '@/assets/ui-kit/input/input';
import Search from '@/assets/ui-kit/icons/search';
import Button from '@/assets/ui-kit/button/button';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { PlatformHeadProps } from './_types';

function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function PlatformHead({
  title,
  description,
  actions = [],
  sections = [],
  currentPath,
  showSearch = false,
  searchProps = {},
  notes = []
}: PlatformHeadProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePath = currentPath || pathname || '';
  const [searchValue, setSearchValue] = useState(searchProps.defaultValue || '');

  // Определяем активный раздел
  const getActiveSectionValue = () => {
    if (!sections.length) return '';
    
    const currentRole = searchParams.get('role');
    if (currentRole === 'owner') return 'owner';
    if (currentRole === 'guest') return 'joined';
    return 'all';
  };

  // Создаем дебаунс функцию
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      if (searchProps.onSearch) {
        searchProps.onSearch(value);
      }
    },
    searchProps.debounceMs || 500
  );

  // Обработчик изменения инпута
  const handleInputChange = (value: string) => {
    setSearchValue(value);
    
    if (searchProps.onInputChange) {
      searchProps.onInputChange(value);
    }
    
    debouncedSearch(value);
  };

  // Обработчик клика по кнопке поиска
  const handleSearchClick = () => {
    if (searchProps.onSearch) {
      searchProps.onSearch(searchValue);
    }
  };

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchProps.onSearch) {
      searchProps.onSearch(searchValue);
    }
  };

  // Синхронизация с defaultValue при изменении пропса
  useEffect(() => {
    if (searchProps.defaultValue !== undefined) {
      setSearchValue(searchProps.defaultValue);
    }
  }, [searchProps.defaultValue]);

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
            value={searchValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.input} 
            variant='glass' 
            placeholder={searchProps.placeholder || "Поиск..."}
          />
          {searchProps.searchButton !== false && (
            <Button 
              className={styles.button} 
              variant='accent'
              onClick={handleSearchClick}
            >
              <Search className={styles.svg} />
            </Button>
          )}
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