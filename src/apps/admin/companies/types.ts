import { PaginationMeta } from '@/apps/shared/pagination/types';

export interface AdminCompany {
    id: string;
    slug: string;
    name: string;
    description: string;
    avatar_url: string;
    is_public: boolean;
    email: string | null;
    region: string;
    site: string | null;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    storage_status: 'none' | 'provisioning' | 'active' | 'failed' | 'deprecated';
    storage_ready: boolean;
    schema_name: string;
}

export interface GetCompaniesResponse {
    companies: AdminCompany[];
    pagination: PaginationMeta;
}

export interface CompanyAccount {
    account_id: string;
    name: string;
    email: string;
    status: string;
    avatar_url: string | null;
    role_code: string;
    joined_at: string;
    is_admin: boolean;
    admin_level: number;
}

export interface GetCompanyAccountsResponse {
    accounts: CompanyAccount[];
    pagination: PaginationMeta;
}