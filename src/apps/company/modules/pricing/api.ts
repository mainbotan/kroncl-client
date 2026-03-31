import { PaginationParams } from "@/apps/shared/pagination/types";
import { CompanyApi } from "../../api";
import { CompanyPricingPlan, MigratePlanRequest, PricingTransaction, PricingTransactionsResponse } from "./types";

export const pricingModule = (companyApi: CompanyApi) => ({
    async getTransactions(
        params?: PaginationParams
    ) {
        return companyApi.get<PricingTransactionsResponse>("/pricing/transactions", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    async getPlan() {
        return companyApi.get<CompanyPricingPlan>("/pricing")
    },
    async migrate(data: MigratePlanRequest) {
        return companyApi.post(`/pricing/migrate`, data);
    },
});