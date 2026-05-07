import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { MetricsServerSnapshot } from './types';

export class AdminServerApi {
    private basePath = '/admin/server';

    async getStats(): Promise<ApiResponse<MetricsServerSnapshot>> {
        return api.get<MetricsServerSnapshot>(`${this.basePath}/sys`);
    }

    async getHistory(params?: {
        start_date?: string;
        end_date?: string;
        limit?: number;
    }): Promise<ApiResponse<MetricsServerSnapshot[]>> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}/history?${queryParams.toString()}`
            : `${this.basePath}/history`;
        
        return api.get<MetricsServerSnapshot[]>(url);
    }
}

export const adminServerApi = new AdminServerApi();