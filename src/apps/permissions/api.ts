import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { BasePermission, Permission } from './types';

export class PermissionsApi {
    private endpoints = {
        permissions: '/permissions',
    };

    // все существующие разрешения
    async getPlatformPermissions(): Promise<ApiResponse<Permission[]>> {
        return api.get<Permission[]>(this.endpoints.permissions);
    }
    
    // доступные компании
    async getCompanyPermissions(companyId: string): Promise<ApiResponse<Permission[]>> {
        return api.get<Permission[]>(`/companies/${companyId}/permissions`);
    }

    // доступные аккаунту в компании
    async getAccountPermissions(companyId: string, accountId: string): Promise<ApiResponse<BasePermission[]>> {
        return api.get<Permission[]>(`/companies/${companyId}/modules/accounts/${accountId}/permissions`);
    }
}

export const permissionsApi = new PermissionsApi();