import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { BecomePartnerRequest } from './types';

export class PartnersApi {
    private endpoints = {
        becomePartner: '/partners/become',
    };

    async becomePartner(data: BecomePartnerRequest): Promise<ApiResponse<{ success: boolean }>> {
        return api.post<{ success: boolean }>(this.endpoints.becomePartner, data);
    }
}

export const partnersApi = new PartnersApi();