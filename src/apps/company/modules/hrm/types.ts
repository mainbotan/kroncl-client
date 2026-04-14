import { PaginationMeta } from "@/apps/shared/pagination/types";

export interface Employee {
    account_id: string | null;
    created_at: string;
    email: string;
    first_name: string;
    id: string;
    is_account_linked: boolean;
    last_name: string;
    linked_at: string | null;
    phone: string | null;
    status: string;
    updated_at: string;
}

export interface EmployeeDetail extends Employee {
    positions: Position[] | null;
}

export interface EmployeesResponse {
    employees: Employee[];
    pagination: PaginationMeta;
}

export interface CreateEmployeeRequest {
    first_name: string;
    last_name?: string;
    email?: string;
    phone?: string;
}

export interface Position {
    id: string;
    name: string;
    description: string | null;
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface PositionsResponse {
    positions: Position[];
    pagination: PaginationMeta;
}

export interface CreatePositionRequest {
    name: string;
    description?: string | null;
    permissions?: string[];
}

export interface UpdatePositionRequest {
    name?: string;
    description?: string | null;
    permissions?: string[];
}

export type GroupBy = "day" | "month" | "year";

export interface GroupedStats {
    group_key: string;
    group_name: string;
    employees_count: number;
    active_count: number;
    inactive_count: number;
}

export interface EmployeesSummary {
    total_positions: number;
    total_employees: number;
    active_employees: number;
    inactive_employees: number;
    new_employees: number;
}

export interface AnalysisParams {
    start_date?: string;
    end_date?: string;
}

export interface GroupedAnalysisParams extends AnalysisParams {
    group_by: GroupBy;
}