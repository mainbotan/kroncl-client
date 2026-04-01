'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { AccountCompany } from '@/apps/account/companies/types';
import { CompanyApi } from './api';
import { CompanyPricingPlan } from './modules/pricing/types';

interface CompanyContextType {
  company: AccountCompany;
  api: CompanyApi;
  companyPlan: CompanyPricingPlan | null;
  setCompanyPlan: (plan: CompanyPricingPlan | null) => void;
  refreshCompanyPlan: () => Promise<void>;
  isLoadingPlan: boolean;
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
  const [companyPlan, setCompanyPlan] = useState<CompanyPricingPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  
  const refreshCompanyPlan = async () => {
    setIsLoadingPlan(true);
    try {
      const response = await api.get<CompanyPricingPlan>('/pricing');
      if (response.status && response.data) {
        setCompanyPlan(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch company plan:', error);
    } finally {
      setIsLoadingPlan(false);
    }
  };
  
  // Загружаем план при монтировании
  useEffect(() => {
    refreshCompanyPlan();
  }, [company.id]);
  
  const contextValue: CompanyContextType = {
    company,
    api,
    companyPlan,
    setCompanyPlan,
    refreshCompanyPlan,
    isLoadingPlan,
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