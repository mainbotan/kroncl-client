import { PaginationMeta, PaginationParams } from "@/apps/shared/pagination/types";

export interface AccountInvitation {
    company_id: string;
    company_name: string;
    created_at: string;
    email: string;
    id: string;
    status: string;
    updated_at: string;
}

export interface GetAccountInvitationsParams extends PaginationParams {
    search?: string;
}

export interface AccountInvitationsResponse {
    invitations: AccountInvitation[];
    pagination: PaginationMeta;
}

export interface AcceptInvitationResponse {
    company_id: string;
    created_at: string;
    email: string;
    id: string;
    status: string;
    updated_at: string;
}

export interface RejectInvitationResponse {
    company_id: string;
    created_at: string;
    email: string;
    id: string;
    status: string;
    updated_at: string;
}