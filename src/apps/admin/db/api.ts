import { api } from '@/apps/shared/bridge/api';
import { SystemStats, SchemaStats, TableInfo, MetricsHistoryItem, GetSchemasResponse } from './types';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { PaginationParams } from '@/apps/shared/pagination/types';

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
        return api.get<SchemaStats>(`${this.basePath}/schemas/${schemaName}/sys`);
    }

    async getSchemaTables(schemaName: string): Promise<ApiResponse<TableInfo[]>> {
        return api.get<TableInfo[]>(`${this.basePath}/schemas/${schemaName}/tables`);
    }

    async getSchemas(params?: {
        search?: string;
        only_tenants?: boolean;
    } & PaginationParams): Promise<ApiResponse<GetSchemasResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.only_tenants === true) queryParams.append('only_tenants', 'true');
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}/schemas?${queryParams.toString()}`
            : `${this.basePath}/schemas`;
        
        return api.get<GetSchemasResponse>(url);
    }

    async migrateAllTenants(keyword: string): Promise<ApiResponse<null>> {
        return api.post<null>(`${this.basePath}/schemas/up`, null, {
            headers: {
                'X-Admin-Keyword': keyword,
            },
        });
    }
}

export const adminDbApi = new AdminDbApi();