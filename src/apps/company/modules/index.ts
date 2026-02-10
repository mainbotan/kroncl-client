import { accountsModule } from "./accounts/api";
import { useCompanyModule } from "./hooks/useModule";
import { hrmModule } from "./hrm/api";
import { storageModule } from "./storage/api";

export const useStorage = () => useCompanyModule(storageModule);
export const useAccounts = () => useCompanyModule(accountsModule);
export const useHrm = () => useCompanyModule(hrmModule)