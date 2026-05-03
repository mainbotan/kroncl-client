import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { UserStats, GetAllAccountsResponse, PromoteRequest } from './types';
import { PaginationParams } from '@/apps/shared/pagination/types';
import { Account } from '@/apps/account/types';

export class AdminAccountsApi {
    private basePath = '/admin/accounts';

    async getAllAccounts(params?: {
        search?: string;
    } & PaginationParams): Promise<ApiResponse<GetAllAccountsResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}?${queryParams.toString()}`
            : this.basePath;
        
        return api.get<GetAllAccountsResponse>(url);
    }

    async getUserStats(): Promise<ApiResponse<UserStats>> {
        return api.get<UserStats>(`${this.basePath}/stats`);
    }

    async getAccountById(accountId: string): Promise<ApiResponse<Account>> {
        return api.get<Account>(`${this.basePath}/${accountId}`);
    }

    async promoteToAdmin(accountId: string, keyword: string, level: number): Promise<ApiResponse<null>> {
        return api.post<null>(`${this.basePath}/${accountId}/promote-admin`, {
            level,
        }, {
            headers: {
                'X-Admin-Keyword': keyword,
            },
        });
    }

    async demoteFromAdmin(accountId: string, keyword: string): Promise<ApiResponse<null>> {
        return api.post<null>(`${this.basePath}/${accountId}/demote-admin`, {}, {
            headers: {
                'X-Admin-Keyword': keyword,
            },
        });
    }
}

export const adminAccountsApi = new AdminAccountsApi();