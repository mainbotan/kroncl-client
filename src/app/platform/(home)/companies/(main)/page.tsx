'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanies } from '@/apps/account/companies/hooks/useCompanies';
import { CompanyCard } from '../components/company-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { cardVariants, containerVariants, emptyStateVariants } from './_animations';
import { PlatformHead } from '@/app/platform/components/lib/head/head';
import { CompaniesHeader } from './head';
import { CompaniesContent } from './content';

// Хук для дебаунса
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Главный компонент
export default function Page() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { companies, loading, error, fetchCompanies, pagination: apiPagination } = useCompanies();

    // Получаем параметры из URL
    const roleParam = searchParams.get('role') || 'all';
    const searchParam = searchParams.get('search') || '';
    const pageParam = searchParams.get('page') || '1';
    const limitParam = searchParams.get('limit') || '20';

    const role = roleParam === 'owner' ? 'owner' : 
                roleParam === 'guest' ? 'guest' : 'all';

    // Локальный стейт для поиска (только для отображения в инпуте)
    const [localSearch, setLocalSearch] = useState(searchParam);
    
    // Дебаунсим локальный поиск
    const debouncedSearch = useDebounce(localSearch, 500);

    // Обновляем URL когда дебаунс закончился
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (debouncedSearch.trim()) {
            params.set('search', debouncedSearch.trim());
        } else {
            params.delete('search');
        }
        
        // Сбрасываем страницу на 1 при поиске
        if (debouncedSearch !== searchParam) {
            params.set('page', '1');
        }
        
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [debouncedSearch, router, searchParam]);

    // Обработчик поиска (только обновляет локальный стейт)
    const handleSearch = useCallback((value: string) => {
        setLocalSearch(value);
    }, []);

    // Загрузка данных при изменении параметров
    useEffect(() => {
        const page = parseInt(pageParam);
        const limit = parseInt(limitParam);
        const search = searchParam || undefined;
        
        fetchCompanies({ 
            role,
            page,
            limit,
            search 
        });
    }, [fetchCompanies, role, searchParam, pageParam, limitParam]);

    // Синхронизация локального стейта с URL
    useEffect(() => {
        setLocalSearch(searchParam);
    }, [searchParam]);

    const noResults = companies.length === 0;
    const hasSearch = searchParam.trim().length > 0;

    return (
        <>
            <CompaniesHeader
              searchQuery={localSearch}
              onSearch={handleSearch}
            />
            
            <CompaniesContent
              role={role}
              searchParam={searchParam}
              companies={companies}
              apiPagination={apiPagination}
              loading={loading}
              error={error}
              noResults={noResults}
              hasSearch={hasSearch}
            />
        </>
    );
}