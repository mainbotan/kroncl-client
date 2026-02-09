import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { PaginationParams, PaginationMeta } from '@/apps/shared/pagination/types';
import { AcceptInvitationResponse, AccountInvitationsResponse, GetAccountInvitationsParams, RejectInvitationResponse } from './types';

export class InvitationsApi {
    private endpoints = {
        invitations: '/account/invitations',
    };

    async getInvitations(
        params?: GetAccountInvitationsParams
    ): Promise<ApiResponse<AccountInvitationsResponse>> {
        const queryParams: Record<string, string> = {};
        
        if (params?.page) queryParams.page = params.page.toString();
        if (params?.limit) queryParams.limit = params.limit.toString();
        if (params?.search) queryParams.search = params.search;

        return api.get<AccountInvitationsResponse>(this.endpoints.invitations, {
            params: queryParams
        });
    }

    async acceptInvitation(id: string): Promise<ApiResponse<AcceptInvitationResponse>> {
        return api.post<AcceptInvitationResponse>(`${this.endpoints.invitations}/${id}/accept`);
    }

    async rejectInvitation(id: string): Promise<ApiResponse<RejectInvitationResponse>> {
        return api.post<RejectInvitationResponse>(`${this.endpoints.invitations}/${id}/reject`);
    }
}

export const invitationsApi = new InvitationsApi();