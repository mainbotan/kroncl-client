'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CompanyCard } from '../components/company-card/card';
import { PlatformPagination } from '@/app/platform/components/lib/pagination/pagination';
import { usePagination } from '@/apps/shared/pagination/hooks/usePagination';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { cardVariants, containerVariants, emptyStateVariants } from './_animations';

export function CompaniesContent({
  role,
  searchParam,
  companies,
  apiPagination,
  loading,
  error,
  noResults,
  hasSearch
}: {
  role: string;
  searchParam: string;
  companies: any[];
  apiPagination: any;
  loading: boolean;
  error: string | null;
  noResults: boolean;
  hasSearch: boolean;
}) {
  const { handlePageChange } = usePagination({
    baseUrl: '/platform/companies',
    defaultLimit: 20
  });

  if (loading) return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      fontSize: ".7em", 
      color: "var(--color-text-description)", 
      minHeight: "10rem"
    }}>
      <Spinner />
    </div>
  );
  
  if (error) return (
    <div style={{
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      fontSize: ".7em", 
      color: "var(--color-text-description)", 
      minHeight: "10rem"
    }}>
      {error}
    </div>
  );
  
  return (
    <>
      {noResults ? (
        <motion.div 
          style={{
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            fontSize: ".7em", 
            color: "var(--color-text-description)", 
            minHeight: "10rem"
          }}
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          {hasSearch ? (
            `По запросу "${searchParam}" ничего не найдено`
          ) : (
            role === 'owner' 
              ? 'Вы не владеете ни одной компанией'
              : role === 'guest'
              ? 'У вас нет приглашений в компании'
              : 'У вас пока нет компаний'
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {hasSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: '16px',
                fontSize: '0.6em',
                padding: '1em 0',
                color: 'var(--color-text-description)'
              }}
            >
              Найдено {apiPagination.total} компаний по запросу "{searchParam}"
            </motion.div>
          )}
          
          <AnimatePresence mode="popLayout">
            {companies.map((company) => (
              <motion.div
                key={company.id}
                variants={cardVariants}
                layout
                layoutId={`company-${company.id}`}
              >
                <CompanyCard company={company} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {apiPagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PlatformPagination
            meta={apiPagination}
            baseUrl="/platform/companies"
            queryParams={{
              role: role !== 'all' ? role : '',
              search: searchParam || undefined
            }}
            onPageChange={(page) => handlePageChange(page, {
              role: role !== 'all' ? role : '',
              search: searchParam || undefined
            })}
          />
        </motion.div>
      )}
    </>
  );
}