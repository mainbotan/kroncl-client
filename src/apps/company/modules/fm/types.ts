import { PaginationMeta } from "@/apps/shared/pagination/types";
import { Employee } from "@/apps/company/modules/hrm/types";

// --------
// TRANSACTIONS
// --------

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type TransactionDirection = 'income' | 'expense';
export type CurrencyType = 'RUB' | 'USD' | 'EUR' | 'KZT';

export interface Transaction {
    id: string;
    base_amount: number;
    currency: CurrencyType;
    direction: TransactionDirection;
    status: TransactionStatus;
    comment: string | null;
    reverse_to: string | null;
    created_at: string;
    metadata: Record<string, any> | null;
}

export interface TransactionListItem extends Transaction {
    employee_id: string | null;
    employee_first_name: string | null;
    employee_last_name: string | null;
    category_id: string | null;
    category_name: string | null;
}

export interface TransactionDetail extends TransactionListItem {
    employee?: Employee;
    category?: TransactionCategory;
}

export interface CreateTransactionRequest {
    base_amount: number;
    currency: CurrencyType;
    direction: TransactionDirection;
    employee_id: string;
    comment?: string;
    category_id?: string;
    status?: string;
    metadata?: Record<string, any>;
}

export interface GetTransactionsParams {
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
    direction?: TransactionDirection;
    status?: TransactionStatus;
    category_id?: string;
    employee_id?: string;
    search?: string;
}

export interface TransactionsResponse {
    transactions: TransactionDetail[];
    pagination: PaginationMeta;
}

// --------
// CATEGORIES
// --------

export type TransactionCategoryDirection = 'income' | 'expense';

export interface TransactionCategory {
    id: string;
    name: string;
    description: string | null;
    direction: TransactionCategoryDirection;
    system: boolean;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryRequest {
    name: string;
    direction: TransactionCategoryDirection;
    description?: string;
    system?: boolean;
}

export interface UpdateCategoryRequest {
    name?: string;
    description?: string | null;
    direction?: TransactionCategoryDirection;
}

export interface GetCategoriesParams {
    page?: number;
    limit?: number;
    direction?: TransactionCategoryDirection;
    search?: string;
}

export interface CategoriesResponse {
    categories: TransactionCategory[];
    pagination: PaginationMeta;
}