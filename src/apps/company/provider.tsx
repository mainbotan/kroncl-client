'use client';

import { createContext, useContext, ReactNode } from 'react';
import { AccountCompany } from '@/apps/account/companies/types';
import { CompanyApi } from './api';

interface CompanyContextType {
  company: AccountCompany;
  api: CompanyApi;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  company: AccountCompany;
  children: ReactNode;
}

export function CompanyProvider({ 
  company, 
  children 
}: CompanyProviderProps) {
  const api = new CompanyApi(company.id);
  
  const contextValue: CompanyContextType = {
    company,
    api,
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany(): CompanyContextType {
  const context = useContext(CompanyContext);
  
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  
  return context;
}