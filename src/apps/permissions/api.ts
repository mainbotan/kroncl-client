import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { Permission } from './types';

export class PermissionsApi {
    private endpoints = {
        permissions: '/permissions',
    };

    async getPermissions(): Promise<ApiResponse<Permission[]>> {
        return api.get<Permission[]>(this.endpoints.permissions);
    }
}

export const permissionsApi = new PermissionsApi();