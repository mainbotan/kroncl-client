import { CompanyApi } from "../../api";
import { CompanyAccount, CompanyAccountsResponse, CompanyInvitationsResponse, DropAccountResponse, InviteAccountRequest, InviteAccountResponse, RevokeInvitationResponse } from "./types";
import { PaginationParams } from "../../../shared/pagination/types";

export const accountsModule = (companyApi: CompanyApi) => ({
  async getAll(
    params?: PaginationParams & { search?: string; role?: string }
  ) {
    return companyApi.get<CompanyAccountsResponse>("/accounts", { 
      params: params as Record<string, string | number | boolean | undefined> 
    });
  },

  
  async getAccount(id: string) {
    return companyApi.get<CompanyAccount>(`/accounts/${id}`);
  },

  async getInvitations(
    params?: PaginationParams
  ) {
    return companyApi.get<CompanyInvitationsResponse>("/accounts/invitations", { 
      params: params as Record<string, string | number | boolean | undefined> 
    });
  },
  
  async revokeInvitation(id: string) {
    return companyApi.delete<RevokeInvitationResponse>(`/accounts/invitations/${id}`);
  },

  async dropAccount(id: string) {
    return companyApi.delete<DropAccountResponse>(`/modules/accounts/${id}`);
  },
  
  async inviteAccount(data: InviteAccountRequest) {
    return companyApi.post<InviteAccountResponse>("/accounts/invitations", data);
  }
});