import { PaginationParams } from "@/apps/shared/pagination/types";
import { CompanyApi } from "../../api";
import {
    // Clients
    Client,
    ClientDetail,
    ClientsResponse,
    CreateClientRequest,
    UpdateClientRequest,
    GetClientsParams,
    // Sources
    ClientSource,
    SourcesResponse,
    CreateSourceRequest,
    UpdateSourceRequest,
    GetSourcesParams,
    // Analysis
    ClientsSummary,
    GroupedClientsStats,
    GetAnalysisParams,
    GroupBy
} from "./types";

export const crmModule = (companyApi: CompanyApi) => ({
    // --------
    // SOURCES
    // --------
    
    async getSources(
        params?: GetSourcesParams
    ) {
        return companyApi.get<SourcesResponse>("/modules/crm/sources", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async getSource(id: string) {
        return companyApi.get<ClientSource>(`/modules/crm/sources/${id}`);
    },
    
    async createSource(data: CreateSourceRequest) {
        return companyApi.post<ClientSource>("/modules/crm/sources", data);
    },
    
    async updateSource(id: string, data: UpdateSourceRequest) {
        return companyApi.patch<ClientSource>(`/modules/crm/sources/${id}`, data);
    },
    
    async activateSource(id: string) {
        return companyApi.post<ClientSource>(`/modules/crm/sources/${id}/activate`);
    },
    
    async deactivateSource(id: string) {
        return companyApi.post<ClientSource>(`/modules/crm/sources/${id}/deactivate`);
    },

    // --------
    // CLIENTS
    // --------
    
    async getClients(
        params?: GetClientsParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {
            ...params
        };
        
        // Если есть sourceId, добавляем его в запрос
        if (params?.sourceId) {
            queryParams.source_id = params.sourceId;
        }
        
        return companyApi.get<ClientsResponse>("/modules/crm/clients", {
            params: queryParams
        });
    },
    
    async getClient(id: string) {
        return companyApi.get<ClientDetail>(`/modules/crm/clients/${id}`);
    },
    
    async createClient(data: CreateClientRequest) {
        return companyApi.post<ClientDetail>("/modules/crm/clients", data);
    },
    
    async updateClient(id: string, data: UpdateClientRequest) {
        return companyApi.patch<ClientDetail>(`/modules/crm/clients/${id}`, data);
    },
    
    async activateClient(id: string) {
        return companyApi.post<ClientDetail>(`/modules/crm/clients/${id}/activate`);
    },
    
    async deactivateClient(id: string) {
        return companyApi.post<ClientDetail>(`/modules/crm/clients/${id}/deactivate`);
    },

    // --------
    // ANALYSIS
    // --------
    
    async getClientsSummary(
        params?: GetAnalysisParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.start_date) queryParams.start_date = params.start_date;
            if (params.end_date) queryParams.end_date = params.end_date;
        }
        
        return companyApi.get<ClientsSummary>("/modules/crm/analysis/summary", {
            params: queryParams
        });
    },
    
    async getGroupedClients(
        params?: GetAnalysisParams & { group_by: GroupBy }
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.start_date) queryParams.start_date = params.start_date;
            if (params.end_date) queryParams.end_date = params.end_date;
            if (params.group_by) queryParams.group_by = params.group_by;
        }
        
        return companyApi.get<GroupedClientsStats[]>("/modules/crm/analysis/grouped", {
            params: queryParams
        });
    }
});