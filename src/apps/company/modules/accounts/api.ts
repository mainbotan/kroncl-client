import { CompanyApi } from "../../api";
import { CompanyAccountsResponse, CompanyInvitationsResponse } from "./types";
import { PaginationParams } from "../../../shared/pagination/types";

export const accountsModule = (companyApi: CompanyApi) => ({
  async getAll(
    params?: PaginationParams & { search?: string; role?: string }
  ) {
    return companyApi.get<CompanyAccountsResponse>("/accounts", { 
      params: params as Record<string, string | number | boolean | undefined> 
    });
  },

  async getInvitations(
    params?: PaginationParams
  ) {
    return companyApi.get<CompanyInvitationsResponse>("/accounts/invitations", { 
      params: params as Record<string, string | number | boolean | undefined> 
    });
  },
});