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
    }
});