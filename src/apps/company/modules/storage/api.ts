import { CompanyApi } from "../../api";
import { StorageModulesData, StorageSources } from './types';
import { useQuery } from '@tanstack/react-query';

export const storageKeys = {
    all: ['storage'] as const,
    sources: (companyId: string) => [...storageKeys.all, 'sources', companyId] as const,
    modules: (companyId: string) => [...storageKeys.all, 'modules', companyId] as const,
};

export const storageModule = (companyApi: CompanyApi) => ({
    async getSources() {
        return companyApi.get<StorageSources>('/storage/sources');
    },
    async getSourcesByModules() {
        return companyApi.get<StorageModulesData>('/storage/sources/modules');
    },
    useSources: (companyId: string) => {
        return useQuery({
            queryKey: storageKeys.sources(companyId),
            queryFn: () => companyApi.get<StorageSources>('/storage/sources'),
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        });
    },
    useModules: (companyId: string) => {
        return useQuery({
            queryKey: storageKeys.modules(companyId),
            queryFn: () => companyApi.get<StorageModulesData>('/storage/sources/modules'),
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
        });
    },
});