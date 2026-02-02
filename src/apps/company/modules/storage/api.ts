import { CompanyApi } from "../../api";
import { StorageSources } from './types';

// Просто объект с методами
export const storageModule = (companyApi: CompanyApi) => ({
  async getSources() {
    return companyApi.get<StorageSources>('/storage/sources');
  }
});