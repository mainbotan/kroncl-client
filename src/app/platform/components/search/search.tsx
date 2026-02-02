'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './search.module.scss';
import clsx from 'clsx';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { areaVariants, canvasVariants, optimizedAreaVariants, optimizedCanvasVariants } from './_animations';
import { CompanyCard } from '../../(home)/companies/components/company-card/card';
import { useCompanies } from '@/apps/account/companies/hooks/useCompanies';
import Upload from '@/assets/ui-kit/icons/upload';
import Collection from '@/assets/ui-kit/icons/collection';
import Settings from '@/assets/ui-kit/icons/settings';
import Keyhole from '@/assets/ui-kit/icons/keyhole';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { quickAccess } from './quick-access.config';
import { memo } from 'react';

interface PllatformSearchProps {
  onClose?: () => void;
}

// Мемоизированный CompanyCard
const MemoizedCompanyCard = memo(CompanyCard);

export function PllatformSearch({ onClose }: PllatformSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Используем хук компаний
  const { companies, loading, fetchCompanies } = useCompanies();

  // Дебаунс поиска компаний - двухэтапный для оптимизации
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 150); // Уменьшили с 300 до 150мс

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchQuery]);

  // Поиск компаний по дебаунсированному запросу
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchCompanies({
        search: debouncedSearch,
        page: 1,
        limit: 10
      });
    } else if (debouncedSearch === '') {
      fetchCompanies({
        page: 1,
        limit: 5
      });
    }
  }, [debouncedSearch, fetchCompanies]);

  // Оптимизированный обработчик клика вне области
  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;
    const clickedOutsideCanvas = canvasRef.current && !canvasRef.current.contains(target);
    const clickedOutsideInput = inputRef.current && !inputRef.current.contains(target);
    
    if (clickedOutsideCanvas && clickedOutsideInput) {
      handleClose();
    }
  }, []);

  // Оптимизированный обработчик нажатия клавиш
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl+K или Cmd+K для открытия
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      handleOpen();
    }
    
    // Escape для закрытия
    if (event.key === 'Escape' && isOpen) {
      handleClose();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => handleClickOutside(event);
    const handleKeyDownEvent = (event: KeyboardEvent) => handleKeyDown(event);
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDownEvent);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [handleClickOutside, handleKeyDown]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setDebouncedSearch('');
    onClose?.();
  }, [onClose]);

  // Обработчик клика на компанию
  const handleCompanyClick = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Searching for:', searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) {
      inputRef.current?.blur();
    }
  }, [isOpen]);

  // Мемоизация результатов рендеринга компаний
  const companyList = useMemo(() => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <Spinner />
        </div>
      );
    }

    if (companies.length > 0) {
      return (
        <div className={styles.list}>
          {companies.map((company) => (
            <div 
              key={company.id} 
              className={styles.companyWrapper}
              onClick={handleCompanyClick}
            >
              <MemoizedCompanyCard company={company} className={styles.item} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={styles.empty}>
        {debouncedSearch
          ? `По запросу "${debouncedSearch}" организаций не найдено`
          : 'Начните вводить название организации'}
      </div>
    );
  }, [companies, loading, debouncedSearch, handleCompanyClick]);

  // Мемоизация быстрого доступа
  const quickAccessItems = useMemo(() => (
    quickAccess.map((item) => (
      <a 
        key={item.id} 
        href={item.href} 
        className={styles.section}
        onClick={handleClose}
      >
        <span className={styles.icon}>
          <item.icon className={styles.svg} />
        </span>
        <span className={styles.name}>{item.title}</span>
      </a>
    ))
  ), [handleClose]);

  return (
    <>
      <div className={styles.wrapper}>
        <Input
          ref={inputRef}
          className={clsx(styles.input, isOpen && styles.focused)}
          variant='elevated'
          placeholder='Поиск по организациям'
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          value={searchQuery}
        />
        <span className={styles.shortcut}>Ctrl + K</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="search-canvas"
            className={styles.canvas}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={optimizedCanvasVariants}
          >
            <motion.div 
              className={styles.area}
              variants={optimizedAreaVariants}
              ref={canvasRef}
            >
              <div className={styles.grid}>
                {/* Быстрый доступ */}
                <div className={styles.group}>
                  <div className={styles.capture}>Быстрый доступ</div>
                  {quickAccessItems}
                </div>

                {/* Компании */}
                <div className={clsx(styles.group, styles.companies)}>
                  <div className={styles.capture}>
                    Организации
                    {debouncedSearch && companies.length > 0 && (
                      <span className={styles.count}>
                        {companies.length} найдено
                      </span>
                    )}
                  </div>
                  {companyList}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}