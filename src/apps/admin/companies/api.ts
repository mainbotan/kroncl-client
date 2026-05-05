import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { AdminCompany, GetCompaniesResponse, GetCompanyAccountsResponse } from './types';
import { PaginationParams } from '@/apps/shared/pagination/types';

export class AdminCompaniesApi {
    private basePath = '/admin/companies';

    async getAllCompanies(params?: {
        search?: string;
    } & PaginationParams): Promise<ApiResponse<GetCompaniesResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}?${queryParams.toString()}`
            : this.basePath;
        
        return api.get<GetCompaniesResponse>(url);
    }

    async getCompanyById(companyId: string): Promise<ApiResponse<AdminCompany>> {
        return api.get<AdminCompany>(`${this.basePath}/${companyId}`);
    }

    
    async getCompanyAccounts(
        companyId: string, 
        params?: PaginationParams
    ): Promise<ApiResponse<GetCompanyAccountsResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}/${companyId}/accounts?${queryParams.toString()}`
            : `${this.basePath}/${companyId}/accounts`;
        
        return api.get<GetCompanyAccountsResponse>(url);
    }
}

export const adminCompaniesApi = new AdminCompaniesApi();