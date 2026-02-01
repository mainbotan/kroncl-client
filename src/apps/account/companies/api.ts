import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { AccountCompaniesResponse, GetAccountCompaniesParams } from './types';

export class CompaniesApi {
    private endpoints = {
        myCompanies: '/companies/my',
    };

    async getUserCompanies(
        params?: GetAccountCompaniesParams
    ): Promise<ApiResponse<AccountCompaniesResponse>> {
        const queryParams: Record<string, string> = {};
        
        if (params?.role) queryParams.role = params.role;
        if (params?.search) queryParams.search = params.search;
        if (params?.page) queryParams.page = params.page.toString();
        if (params?.limit) queryParams.limit = params.limit.toString();

        return api.get<AccountCompaniesResponse>(this.endpoints.myCompanies, {
            params: queryParams
        });
    }
}

export const companiesApi = new CompaniesApi();