'use client';

import Input from '@/assets/ui-kit/input/input';
import styles from './search.module.scss';
import clsx from 'clsx';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { areaVariants, canvasVariants } from './_animations';
import { CompanyCard } from '../../(home)/companies/components/company-card/card';
import { useCompanies } from '@/apps/account/companies/hooks/useCompanies';
import Upload from '@/assets/ui-kit/icons/upload';
import Collection from '@/assets/ui-kit/icons/collection';
import Settings from '@/assets/ui-kit/icons/settings';
import Keyhole from '@/assets/ui-kit/icons/keyhole';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { quickAccess } from './quick-access.config';

interface PllatformSearchProps {
  onClose?: () => void;
}

export function PllatformSearch({ onClose }: PllatformSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Используем хук компаний
  const { companies, loading, fetchCompanies } = useCompanies();

  // Дебаунс поиска компаний
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim() && searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchCompanies({
          search: searchQuery.trim(),
          page: 1,
          limit: 10
        });
      }, 300);
    } else {
      fetchCompanies({
        page: 1,
        limit: 5
      });
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, fetchCompanies]);

  // Обработчик клика вне области
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      canvasRef.current && 
      !canvasRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      handleClose();
    }
  }, []);

  // Обработчик нажатия клавиш
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
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClickOutside, handleKeyDown]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
    onClose?.();
  };

  // Обработчик клика на компанию
  const handleCompanyClick = useCallback(() => {
    handleClose();
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Searching for:', searchQuery);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      inputRef.current?.blur();
    }
  }, [isOpen]);

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
            variants={canvasVariants}
          >
            <motion.div 
              className={styles.area}
              variants={areaVariants}
              ref={canvasRef}
            >
              <div className={styles.grid}>
                {/* Быстрый доступ */}
                <div className={styles.group}>
                  <div className={styles.capture}>Быстрый доступ</div>
                  {quickAccess.map((item) => (
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
                  ))}
                </div>

                {/* Компании */}
                <div className={clsx(styles.group, styles.companies)}>
                  <div className={styles.capture}>
                    Организации
                    {searchQuery && companies.length > 0 && (
                      <span className={styles.count}>
                        {companies.length} найдено
                      </span>
                    )}
                  </div>
                  
                  {loading ? (
                    <div className={styles.loading}>
                      <Spinner />
                    </div>
                  ) : companies.length > 0 ? (
                    <div className={styles.list}>
                      {companies.map((company) => (
                        <div 
                          key={company.id} 
                          className={styles.companyWrapper}
                          onClick={handleCompanyClick}
                        >
                          <CompanyCard company={company} className={styles.item} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.empty}>
                      {searchQuery
                        ? `По запросу "${searchQuery}" организаций не найдено`
                        : 'Начните вводить название организации'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}