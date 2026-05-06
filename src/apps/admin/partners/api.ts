import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { IncomingPartner, GetPartnersResponse, UpdatePartnerRequest } from './types';
import { PaginationParams } from '@/apps/shared/pagination/types';

export class AdminPartnersApi {
    private basePath = '/admin/partners';

    async getPartners(params?: {
        status?: string;
        search?: string;
    } & PaginationParams): Promise<ApiResponse<GetPartnersResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}?${queryParams.toString()}`
            : this.basePath;
        
        return api.get<GetPartnersResponse>(url);
    }

    async getPartnerById(partnerId: string): Promise<ApiResponse<IncomingPartner>> {
        return api.get<IncomingPartner>(`${this.basePath}/${partnerId}`);
    }

    async updatePartner(partnerId: string, data: UpdatePartnerRequest): Promise<ApiResponse<IncomingPartner>> {
        return api.patch<IncomingPartner>(`${this.basePath}/${partnerId}`, data);
    }
}

export const adminPartnersApi = new AdminPartnersApi();