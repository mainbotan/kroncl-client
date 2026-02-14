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
    GetCategoriesParams
} from "./types";

export const fmModule = (companyApi: CompanyApi) => ({
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
    }
});