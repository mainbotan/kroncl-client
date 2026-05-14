import { PaginationMeta } from '@/apps/shared/pagination/types';

export interface Promocode {
    id: string;
    code: string;
    plan_id: string;
    plan_name: string;
    trial_period_days: number;
    created_at: string;
    updated_at: string;
}

export interface GetPromocodesResponse {
    promocodes: Promocode[];
    pagination: PaginationMeta;
}

export interface CreatePromocodeRequest {
    code: string;
    plan_id: string;
    trial_period_days: number;
}

export interface UpdatePromocodeRequest {
    code?: string;
    plan_id?: string;
    trial_period_days?: number;
}