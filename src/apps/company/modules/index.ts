import { useCompanyModule } from "./hooks/useModule";
import { storageModule } from "./storage/api";

export const useStorage = () => useCompanyModule(storageModule);