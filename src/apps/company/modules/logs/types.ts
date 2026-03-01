import { PaginationMeta } from "@/apps/shared/pagination/types";

export type LogStatus = "success" | "error" | "pending";

export interface Log {
    id: string;
    key: string;                    // permission key (e.g., fm.transactions.create)
    status: LogStatus;               // success, error, pending
    criticality: number;             // 1-10
    account_id: string;
    request_id: string | null;       // request ID for grouping
    user_agent: string | null;       // browser/client
    ip: string | null;               // IP address
    metadata: Record<string, any>;    // additional details
    created_at: string;
}

// LogListItem represents log in list views
export type LogListItem = Log;

// LogDetail represents detailed log view
export type LogDetail = LogListItem;

// Request params for listing logs
export interface GetLogsRequest {
    page?: number;
    limit?: number;
    account_id?: string;
    key?: string;                    // filter by key (fm.transactions.create)
    status?: LogStatus;               // filter by status
    min_criticality?: number;         // 1-10
    max_criticality?: number;         // 1-10
    start_date?: string;              // ISO date string
    end_date?: string;                // ISO date string
    search?: string;                  // search in metadata
}

// Paginated response
export interface LogsResponse {
    logs: LogListItem[];
    pagination: PaginationMeta;
}