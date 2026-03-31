import { PricingPlan } from "@/apps/pricing/types";
import { CurrencyType } from "../wm/types";
import { PaginationMeta } from "@/apps/shared/pagination/types";

export interface CompanyPlan {
  is_trial: boolean;
  expires_at: string;
  days_left: number;
  current_plan: PricingPlan;
  next_plan?: PricingPlan;
}

export interface MigratePlanRequest {
  plan_code: string;
  period: "month" | "year";
}

export type TransactionStatus = "success" | "pending" | "unsuccess";

export interface PricingTransaction {
  id: string;
  company_id: string;
  account_id: string;
  amount: number | null;
  currency: CurrencyType;
  status: TransactionStatus;
  plan_code: string | null;
  is_trial: boolean;
  next_plan_code: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface PricingTransactionsResponse {
    transactions: PricingTransaction[];
    pagination: PaginationMeta;
}