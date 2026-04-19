import { Company } from '@/apps/company/init/types';
import { PaginationParams, PaginationMeta } from '@/apps/shared/pagination/types';

export interface AccountCompany extends Company {
    joined_at: string;
    role_code: string;
}

export interface GetAccountCompaniesParams extends PaginationParams {
    role?: string;
    search?: string;
}

export interface AccountCompaniesResponse {
    companies: AccountCompany[];
    pagination: PaginationMeta;
}