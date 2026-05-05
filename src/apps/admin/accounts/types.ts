import { Account } from '@/apps/account/types';
import { PaginationMeta } from '@/apps/shared/pagination/types';

export interface UserStats {
    total_accounts: number;
    confirmed_accounts: number;
    waiting_accounts: number;
    admin_accounts: number;
    accounts_with_type: Record<string, number>;
}

export interface PromoteRequest {
    level: number;
}

export interface GetAllAccountsResponse {
    accounts: Account[];
    pagination: PaginationMeta;
}