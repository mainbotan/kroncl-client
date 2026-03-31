import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { PricingPlan, PricingPlansResponse } from './types';

export class PricingApi {
    private endpoints = {
        plans: '/plans',
        plan: (code: string) => `/plans/${code}`
    };

    async getPlans(): Promise<ApiResponse<PricingPlansResponse>> {
        return api.get<PricingPlansResponse>(this.endpoints.plans);
    }
    async getPlan(code: string): Promise<ApiResponse<PricingPlan>> {
        return api.get<PricingPlan>(this.endpoints.plan(code));
    }
}