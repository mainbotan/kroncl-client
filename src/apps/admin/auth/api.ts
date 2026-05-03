import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { AdminAccount, AdminCheckResponse } from './types';

export class AdminApi {
    private endpoints = {
        check: '/admin/check',
        profile: '/account',
    };

    async checkAdminAccess(): Promise<AdminCheckResponse> {
        try {
            const response = await api.get<AdminCheckResponse>(this.endpoints.check);
            if (response.status && response.data) {
                return {
                    is_admin: response.data.is_admin,
                    admin_level: response.data.admin_level || 0,
                };
            }
            return { is_admin: false, admin_level: 0 };
        } catch {
            return { is_admin: false, admin_level: 0 };
        }
    }

    async getAdminProfile(): Promise<AdminAccount | null> {
        try {
            const response = await api.get<AdminAccount>(this.endpoints.profile);
            if (response.status && response.data) {
                return response.data;
            }
            return null;
        } catch {
            return null;
        }
    }
}

export const adminApi = new AdminApi();