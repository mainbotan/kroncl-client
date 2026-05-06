import { PaginationMeta } from "@/apps/shared/pagination/types";
import { AccountPublic } from "@/apps/account/types";
import { Company } from "@/apps/company/init/types";
import { TicketStatus, Message } from "@/apps/company/modules/support/types";

export interface AdminTicket {
    id: string;
    company: Company;
    initiator: AccountPublic;
    theme: string;
    status: TicketStatus;
    created_at: string;
    updated_at: string;
    last_message: Message | null;
    assigned_admin_id: string | null;
}

export interface GetTicketsResponse {
    tickets: AdminTicket[];
    pagination: PaginationMeta;
}

export interface CreateAdminMessageRequest {
    text: string;
}

export interface UpdateAdminMessageRequest {
    text: string;
}