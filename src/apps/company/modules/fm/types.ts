import { PaginationMeta } from "@/apps/shared/pagination/types";
import { Employee } from "@/apps/company/modules/hrm/types";

// --------
// ANALYSIS
// --------

export type GroupBy = 'category' | 'employee' | 'day' | 'month';

export interface AnalysisSummary {
    total_income: number;
    total_expense: number;
    net_balance: number;
    transaction_count: number;
    avg_transaction: number;
}

export interface GroupedStats {
    group_key: string;
    group_name: string;
    income: number;
    expense: number;
    net: number;
    count: number;
}

export interface GetAnalysisParams {
    start_date?: string;
    end_date?: string;
    group_by?: GroupBy;
}

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

// --------
// COUNTERPARTIES
// --------

export type CounterpartyType = 'bank' | 'organization' | 'person';
export type CounterpartyStatus = 'active' | 'inactive';

export interface Counterparty {
    id: string;
    name: string;
    comment: string | null;
    type: CounterpartyType;
    status: CounterpartyStatus;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCounterpartyRequest {
    name: string;
    type: CounterpartyType;
    comment?: string;
    status?: CounterpartyStatus;
    metadata?: Record<string, any>;
}

export interface UpdateCounterpartyRequest {
    name?: string;
    comment?: string | null;
    type?: CounterpartyType;
    metadata?: Record<string, any>;
}

export interface GetCounterpartiesParams {
    page?: number;
    limit?: number;
    type?: CounterpartyType;
    status?: CounterpartyStatus;
    search?: string;
}

export interface CounterpartiesResponse {
    counterparties: Counterparty[];
    pagination: PaginationMeta;
}

// --------
// CREDITS
// --------

export type CreditType = 'debt' | 'credit';
export type CreditStatus = 'active' | 'closed';

export interface Credit {
    id: string;
    name: string;
    comment: string | null;
    type: CreditType;
    status: CreditStatus;
    total_amount: number;
    currency: CurrencyType;
    interest_rate: number;
    start_date: string;
    end_date: string;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CreditDetail extends Credit {
    counterparty: Counterparty;
}

export interface CreateCreditRequest {
    name: string;
    type: CreditType;
    total_amount: number;
    currency: CurrencyType;
    interest_rate: number;
    start_date: string;
    end_date: string;
    counterparty_id: string;
    comment?: string;
    metadata?: Record<string, any>;
}

export interface UpdateCreditRequest {
    name?: string;
    comment?: string | null;
    type?: CreditType;
    total_amount?: number;
    currency?: CurrencyType;
    interest_rate?: number;
    start_date?: string;
    end_date?: string;
    counterparty_id?: string;
    metadata?: Record<string, any>;
}

export interface GetCreditsParams {
    page?: number;
    limit?: number;
    type?: CreditType;
    status?: CreditStatus;
    search?: string;
}

export interface CreditsResponse {
    credits: CreditDetail[];
    pagination: PaginationMeta;
}

// --------
// CREDIT PAYMENTS
// --------

export interface PayCreditRequest {
    employee_id: string;
    amount: number;
    paid_at: string;
    comment?: string;
}

export interface CreditPaymentsParams {
    page?: number;
    limit?: number;
}

export interface CreditPaymentsResponse {
    transactions: TransactionDetail[];
    pagination: PaginationMeta;
}