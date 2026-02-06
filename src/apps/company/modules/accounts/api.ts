import { CompanyApi } from "../../api";
import { CompanyAccountsResponse } from "./types";
import { PaginationParams } from "../../../shared/pagination/types";

export const accountsModule = (companyApi: CompanyApi) => ({
  async getAll(
    params?: PaginationParams & { search?: string; role?: string }
  ) {
    return companyApi.get<CompanyAccountsResponse>("/accounts", { 
      params: params as Record<string, string | number | boolean | undefined> 
    });
  },
});