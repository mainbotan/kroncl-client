import { PaginationParams } from "@/apps/shared/pagination/types";
import { CompanyApi } from "../../api";
import {
    Transaction,
    TransactionDetail,
    TransactionsResponse,
    CreateTransactionRequest,
    GetTransactionsParams,
    TransactionCategory,
    CategoriesResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    GetCategoriesParams,
    GetAnalysisParams,
    GroupBy,
    AnalysisSummary,
    GroupedStats,
    // COUNTERPARTIES
    Counterparty,
    CounterpartiesResponse,
    CreateCounterpartyRequest,
    UpdateCounterpartyRequest,
    GetCounterpartiesParams
} from "./types";

export const fmModule = (companyApi: CompanyApi) => ({
    // --------
    // ANALYSIS
    // --------
    
    async getAnalysisSummary(
        params?: GetAnalysisParams
    ) {
        return companyApi.get<AnalysisSummary>("/modules/fm/analysis/summary", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async getGroupedAnalysis(
        params?: GetAnalysisParams & { group_by: GroupBy }
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.start_date) queryParams.start_date = params.start_date;
            if (params.end_date) queryParams.end_date = params.end_date;
            if (params.group_by) queryParams.group_by = params.group_by;
        }
        
        return companyApi.get<GroupedStats[]>("/modules/fm/analysis/grouped", {
            params: queryParams
        });
    },

    // --------
    // TRANSACTIONS
    // --------
    
    async getTransactions(
        params?: GetTransactionsParams
    ) {
        return companyApi.get<TransactionsResponse>("/modules/fm/transactions", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async getTransaction(id: string) {
        return companyApi.get<TransactionDetail>(`/modules/fm/transactions/${id}`);
    },

    async createReverseTransaction(id: string) {
        return companyApi.post<TransactionDetail>(`/modules/fm/transactions/${id}/reverse`);
    },
    
    async createTransaction(data: CreateTransactionRequest) {
        return companyApi.post<TransactionDetail>("/modules/fm/transactions", data);
    },

    // --------
    // CATEGORIES
    // --------
    
    async getCategories(
        params?: GetCategoriesParams
    ) {
        return companyApi.get<CategoriesResponse>("/modules/fm/transactions/categories", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async getCategory(id: string) {
        return companyApi.get<TransactionCategory>(`/modules/fm/transactions/categories/${id}`);
    },
    
    async getCategoryBySlug(slug: string) {
        return companyApi.get<TransactionCategory>(`/modules/fm/transactions/categories/slug/${slug}`);
    },
    
    async createCategory(data: CreateCategoryRequest) {
        return companyApi.post<TransactionCategory>("/modules/fm/transactions/categories", data);
    },
    
    async updateCategory(id: string, data: UpdateCategoryRequest) {
        return companyApi.patch<TransactionCategory>(`/modules/fm/transactions/categories/${id}`, data);
    },
    
    async deleteCategory(id: string) {
        return companyApi.delete<{ category_id: string; deleted: boolean }>(`/modules/fm/transactions/categories/${id}`);
    },

    // --------
    // COUNTERPARTIES
    // --------
    
    async getCounterparties(
        params?: GetCounterpartiesParams
    ) {
        return companyApi.get<CounterpartiesResponse>("/modules/fm/counterparties", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async getCounterparty(id: string) {
        return companyApi.get<Counterparty>(`/modules/fm/counterparties/${id}`);
    },
    
    async createCounterparty(data: CreateCounterpartyRequest) {
        return companyApi.post<Counterparty>("/modules/fm/counterparties", data);
    },
    
    async updateCounterparty(id: string, data: UpdateCounterpartyRequest) {
        return companyApi.patch<Counterparty>(`/modules/fm/counterparties/${id}`, data);
    },
    
    async activateCounterparty(id: string) {
        return companyApi.post<Counterparty>(`/modules/fm/counterparties/${id}/activate`);
    },
    
    async deactivateCounterparty(id: string) {
        return companyApi.post<Counterparty>(`/modules/fm/counterparties/${id}/deactivate`);
    }
});