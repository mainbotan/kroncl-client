import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { Promocode, GetPromocodesResponse, CreatePromocodeRequest, UpdatePromocodeRequest } from './types';
import { PaginationParams } from '@/apps/shared/pagination/types';

export class AdminPricingPromocodesApi {
    private basePath = '/admin/pricing/promocodes';

    async getPromocodes(params?: PaginationParams): Promise<ApiResponse<GetPromocodesResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}?${queryParams.toString()}`
            : this.basePath;
        
        return api.get<GetPromocodesResponse>(url);
    }

    async getPromocodeById(promocodeId: string): Promise<ApiResponse<Promocode>> {
        return api.get<Promocode>(`${this.basePath}/${promocodeId}`);
    }

    async createPromocode(data: CreatePromocodeRequest): Promise<ApiResponse<Promocode>> {
        return api.post<Promocode>(this.basePath, data);
    }

    async updatePromocode(promocodeId: string, data: UpdatePromocodeRequest): Promise<ApiResponse<Promocode>> {
        return api.patch<Promocode>(`${this.basePath}/${promocodeId}`, data);
    }

    async deletePromocode(promocodeId: string): Promise<ApiResponse<null>> {
        return api.delete<null>(`${this.basePath}/${promocodeId}`);
    }
}

export const adminPricingPromocodesApi = new AdminPricingPromocodesApi();