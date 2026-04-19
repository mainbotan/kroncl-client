import { CompanyApi } from "../../api";
import { CreateTransactionRequest, GetTransactionsParams, TransactionDetail, TransactionsResponse } from "../fm/types";
import {
    // Deal Types
    DealType,
    DealTypesResponse,
    CreateDealTypeRequest,
    UpdateDealTypeRequest,
    GetDealTypesParams,
    // Deal Statuses
    DealStatus,
    DealStatusesResponse,
    CreateDealStatusRequest,
    UpdateDealStatusRequest,
    GetDealStatusesParams,
    // Deals
    Deal,
    DealWithPositions,
    DealsResponse,
    CreateDealRequest,
    UpdateDealRequest,
    GetDealsParams,
    DealGroup,
    DealTransactionsSummary,
} from "./types";

export const dmModule = (companyApi: CompanyApi) => ({
    // --------
    // DEAL TYPES
    // --------

    async reorderDealStatuses(statusIds: string[]) {
        return companyApi.put<{ reordered: boolean; status_ids: string[] }>(
            "/modules/dm/statuses/reorder", 
            { status_ids: statusIds }
        );
    },
    
    async getDealTypes(
        params?: GetDealTypesParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.page !== undefined) queryParams.page = params.page;
            if (params.limit !== undefined) queryParams.limit = params.limit;
            if (params.search !== undefined) queryParams.search = params.search;
        }
        
        return companyApi.get<DealTypesResponse>("/modules/dm/types", {
            params: queryParams
        });
    },
    
    async getDealType(id: string) {
        return companyApi.get<DealType>(`/modules/dm/types/${id}`);
    },
    
    async createDealType(data: CreateDealTypeRequest) {
        return companyApi.post<DealType>("/modules/dm/types", data);
    },
    
    async updateDealType(id: string, data: UpdateDealTypeRequest) {
        return companyApi.patch<DealType>(`/modules/dm/types/${id}`, data);
    },
    
    async deleteDealType(id: string) {
        return companyApi.delete<{ type_id: string; deleted: boolean }>(`/modules/dm/types/${id}`);
    },

    // --------
    // DEAL STATUSES
    // --------
    
    async getDealStatuses(
        params?: GetDealStatusesParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.page !== undefined) queryParams.page = params.page;
            if (params.limit !== undefined) queryParams.limit = params.limit;
            if (params.search !== undefined) queryParams.search = params.search;
        }
        
        return companyApi.get<DealStatusesResponse>("/modules/dm/statuses", {
            params: queryParams
        });
    },
    
    async getDealStatus(id: string) {
        return companyApi.get<DealStatus>(`/modules/dm/statuses/${id}`);
    },
    
    async createDealStatus(data: CreateDealStatusRequest) {
        return companyApi.post<DealStatus>("/modules/dm/statuses", data);
    },
    
    async updateDealStatus(id: string, data: UpdateDealStatusRequest) {
        return companyApi.patch<DealStatus>(`/modules/dm/statuses/${id}`, data);
    },
    
    async deleteDealStatus(id: string) {
        return companyApi.delete<{ status_id: string; deleted: boolean }>(`/modules/dm/statuses/${id}`);
    },

    // --------
    // DEALS
    // --------
    
    async getDeals(
        params?: GetDealsParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.page !== undefined) queryParams.page = params.page;
            if (params.limit !== undefined) queryParams.limit = params.limit;
            if (params.type_id !== undefined) queryParams.type_id = params.type_id;
            if (params.status_id !== undefined) queryParams.status_id = params.status_id;
            if (params.client_id !== undefined) queryParams.client_id = params.client_id;
            if (params.employee_id !== undefined) queryParams.employee_id = params.employee_id;
            if (params.search !== undefined) queryParams.search = params.search;
            if (params.group_by !== undefined) queryParams.group_by = params.group_by;
        }
        
        // Если group_by=status, ответ будет DealsGroupedResponse, иначе DealsResponse
        if (params?.group_by === 'status') {
            return companyApi.get<DealGroup[]>("/modules/dm/deals", {
                params: queryParams
            });
        }
        
        return companyApi.get<DealsResponse>("/modules/dm/deals", {
            params: queryParams
        });
    },
    
    async getDeal(id: string) {
        return companyApi.get<DealWithPositions>(`/modules/dm/deals/${id}`);
    },
    
    async createDeal(data: CreateDealRequest) {
        return companyApi.post<DealWithPositions>("/modules/dm/deals", data);
    },
    
    async updateDeal(id: string, data: UpdateDealRequest) {
        return companyApi.patch<DealWithPositions>(`/modules/dm/deals/${id}`, data);
    },
    
    async deleteDeal(id: string) {
        return companyApi.delete<{ deal_id: string; deleted: boolean }>(`/modules/dm/deals/${id}`);
    },

    // --------
    // DEAL TRANSACTIONS
    // --------
    
    async getDealTransactions(
        dealId: string,
        params?: GetTransactionsParams
    ) {
        return companyApi.get<TransactionsResponse>(`/modules/dm/deals/${dealId}/transactions`, {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async createDealTransaction(dealId: string, data: CreateTransactionRequest) {
        return companyApi.post<TransactionDetail>(`/modules/dm/deals/${dealId}/transactions`, data);
    },

    async getDealTransactionsSummary(dealId: string) {
        return companyApi.get<DealTransactionsSummary>(`/modules/dm/deals/${dealId}/transactions/summary`);
    },
});