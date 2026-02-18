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
    GetCounterpartiesParams,
    // CREDITS
    Credit,
    CreditDetail,
    CreditsResponse,
    CreateCreditRequest,
    UpdateCreditRequest,
    GetCreditsParams,
    PayCreditRequest,
    CreditPaymentsResponse,
    CreditPaymentsParams
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
    },

    // --------
    // CREDITS
    // --------
    
    async getCredits(
        params?: GetCreditsParams
    ) {
        return companyApi.get<CreditsResponse>("/modules/fm/credits", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    
    async getCredit(id: string) {
        return companyApi.get<CreditDetail>(`/modules/fm/credits/${id}`);
    },
    
    async createCredit(data: CreateCreditRequest) {
        return companyApi.post<CreditDetail>("/modules/fm/credits", data);
    },
    
    async updateCredit(id: string, data: UpdateCreditRequest) {
        return companyApi.patch<CreditDetail>(`/modules/fm/credits/${id}`, data);
    },
    
    async activateCredit(id: string) {
        return companyApi.post<CreditDetail>(`/modules/fm/credits/${id}/activate`);
    },
    
    async deactivateCredit(id: string) {
        return companyApi.post<CreditDetail>(`/modules/fm/credits/${id}/deactivate`);
    },
    
    async payCredit(id: string, data: PayCreditRequest) {
        return companyApi.post<TransactionDetail>(`/modules/fm/credits/${id}/pay`, data);
    },
    
    async getCreditTransactions(
        id: string,
        params?: CreditPaymentsParams
    ) {
        return companyApi.get<CreditPaymentsResponse>(`/modules/fm/credits/${id}/transactions`, {
            params: params as Record<string, string | number | boolean | undefined>
        });
    }
});