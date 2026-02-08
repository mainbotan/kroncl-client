import { PaginationMeta } from "@/apps/shared/pagination/types";

// вроде где-то уже есть, похуй уберём ))) ага конечно ебанат, забудешь ты
export interface CompanyAccount {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role_id: string;
  role_code: string;
  role_name: string;
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
