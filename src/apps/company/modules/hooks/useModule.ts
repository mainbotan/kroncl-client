'use client';

import { useCompany } from "../../provider";
import { CompanyApi } from "../../api";

export function useCompanyModule<T extends object>(
  moduleFactory: (companyApi: CompanyApi) => T
): T {
  const { api } = useCompany();
  return moduleFactory(api);
}