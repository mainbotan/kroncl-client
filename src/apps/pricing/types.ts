import { PaginationMeta } from "../shared/pagination/types";

export interface PricingPlan {
  code: string;
  lvl: number;
  price_per_month: number;
  price_per_year: number;
  price_currency: "RUB";
  name: string;
  description: string;
  limit_db_mb: number;
  limit_objects_mb: number;
  limit_objects_count: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPlansResponse {
  plans: PricingPlan[];
  pagination: PaginationMeta;
}