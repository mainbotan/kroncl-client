import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { PaginationParams } from '@/apps/shared/pagination/types';
import { AdminTicket, GetTicketsResponse, CreateAdminMessageRequest, UpdateAdminMessageRequest } from './types';
import { Message } from '@/apps/company/modules/support/types';

export class AdminSupportApi {
    private basePath = '/admin';

    // Тикеты
    async getTickets(params?: {
        status?: string;
    } & PaginationParams): Promise<ApiResponse<GetTicketsResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        
        const url = queryParams.toString() 
            ? `${this.basePath}/tickets?${queryParams.toString()}`
            : `${this.basePath}/tickets`;
        
        return api.get<GetTicketsResponse>(url);
    }

    async getTicketById(ticketId: string): Promise<ApiResponse<AdminTicket>> {
        return api.get<AdminTicket>(`${this.basePath}/tickets/${ticketId}`);
    }

    async assignTicket(ticketId: string): Promise<ApiResponse<null>> {
        return api.post<null>(`${this.basePath}/tickets/${ticketId}/assign`);
    }

    async unassignTicket(ticketId: string): Promise<ApiResponse<null>> {
        return api.post<null>(`${this.basePath}/tickets/${ticketId}/unassign`);
    }

    async closeTicket(ticketId: string): Promise<ApiResponse<null>> {
        return api.post<null>(`${this.basePath}/tickets/${ticketId}/close`);
    }

    // Сообщения
    async getTicketMessages(ticketId: string): Promise<ApiResponse<Message[]>> {
        return api.get<Message[]>(`${this.basePath}/tickets/${ticketId}/messages`);
    }

    async createAdminMessage(ticketId: string, data: CreateAdminMessageRequest): Promise<ApiResponse<Message>> {
        return api.post<Message>(`${this.basePath}/tickets/${ticketId}/messages`, data);
    }

    async updateAdminMessage(ticketId: string, messageId: string, data: UpdateAdminMessageRequest): Promise<ApiResponse<Message>> {
        return api.patch<Message>(`${this.basePath}/tickets/${ticketId}/messages/${messageId}`, data);
    }

    async deleteAdminMessage(ticketId: string, messageId: string): Promise<ApiResponse<null>> {
        return api.delete<null>(`${this.basePath}/tickets/${ticketId}/messages/${messageId}`);
    }
}

export const adminSupportApi = new AdminSupportApi();