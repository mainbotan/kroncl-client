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