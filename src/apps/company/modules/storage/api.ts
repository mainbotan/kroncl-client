import { CompanyApi } from "../../api";
import { StorageModulesData, StorageSources } from './types';

export const storageModule = (companyApi: CompanyApi) => ({
  async getSources() {
    return companyApi.get<StorageSources>('/storage/sources');
  },
  async getSourcesByModules() {
    return companyApi.get<StorageModulesData>('/storage/sources/modules');
  }
});