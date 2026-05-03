import { api } from '@/apps/shared/bridge/api';
import { SystemStats, SchemaStats, TableInfo, MetricsHistoryItem } from './types';
import { ApiResponse } from '@/apps/shared/bridge/types';

export class AdminDbApi {
    private basePath = '/admin/db';

    async getSystemStats(): Promise<ApiResponse<SystemStats>> {
        return api.get<SystemStats>(`${this.basePath}/sys`);
    }

    async getMetricsHistory(params?: {
        start_date?: string;
        end_date?: string;
        limit?: number;
    }): Promise<ApiResponse<MetricsHistoryItem[]>> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}/history?${queryParams.toString()}`
            : `${this.basePath}/history`;
        
        return api.get<MetricsHistoryItem[]>(url);
    }

    async getSchemaStats(schemaName: string): Promise<ApiResponse<SchemaStats>> {
        return api.get<SchemaStats>(`${this.basePath}/${schemaName}/sys`);
    }

    async getSchemaTables(schemaName: string): Promise<ApiResponse<TableInfo[]>> {
        return api.get<TableInfo[]>(`${this.basePath}/${schemaName}/tables`);
    }
}

export const adminDbApi = new AdminDbApi();