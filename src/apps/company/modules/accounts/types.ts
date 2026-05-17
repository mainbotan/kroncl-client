import { PaginationMeta } from "@/apps/shared/pagination/types";

// вроде где-то уже есть, похуй уберём ))) ага конечно ебанат, забудешь ты
export interface CompanyAccount {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role_code: string;
  status: string;
  created_at: string;
  joined_at: string;
}

export interface CompanyAccountsResponse {
  accounts: CompanyAccount[];
  pagination: PaginationMeta;
}

export interface CompanyInvitation {
  id: string;
  company_id: string;
  email: string;
  status: string;
  role_code: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyInvitationsResponse {
  invitations: CompanyInvitation[];
  pagination: PaginationMeta;
}

export interface RevokeInvitationResponse {
  company_id: string;
  invitation_id: string;
  revoked: boolean;
}

export interface DropAccountResponse {
  account_id: string;
  removed: boolean;
}

export interface InviteAccountRequest {
  email: string;
  role_code?: string;
}

export interface InviteAccountResponse {
  company_id: string;
  created_at: string;
  email: string;
  id: string;
  status: string;
  updated_at: string;
}

// SETTINGS

export interface CompanyAccountSettings {
  account_id: string;
  increase_permissions: string[] | null;
  reduce_permissions: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateCompanyAccountSettingsRequest {
  increase_permissions?: string[] | null;
  reduce_permissions?: string[] | null;
}