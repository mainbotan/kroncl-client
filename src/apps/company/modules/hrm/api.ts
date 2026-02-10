import { PaginationParams } from "@/apps/shared/pagination/types";
import { CompanyApi } from "../../api";
import { CreateEmployeeRequest, Employee, EmployeesResponse } from "./types";

export const hrmModule = (companyApi: CompanyApi) => ({
    async getEmployees(
        params?: PaginationParams & {search?: string;}
    ) {
        return companyApi.get<EmployeesResponse>("/modules/hrm/employees", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    async getEmployee(id: string) {
        return companyApi.get<Employee>(`/modules/hrm/employees/${id}`)
    },
    async deleteEmployee(id: string) {
        return companyApi.delete<Employee>(`/modules/hrm/employees/${id}`)
    },
    async createEmployee(data: CreateEmployeeRequest) {
        return companyApi.post<Employee>("/modules/hrm/employees", data);
    },
    async updateEmployee(id: string, data: CreateEmployeeRequest) {
        return companyApi.patch<Employee>(`/modules/hrm/employees/${id}`, data);
    },
    async linkAccountToEmployee(employeeId: string, accountId: string) {
        return companyApi.post<Employee>(`/modules/hrm/employees/${employeeId}/link-account`, {account_id: accountId });
    },
    async unlinkAccountFromEmployee(employeeId: string) {
        return companyApi.post<Employee>(`/modules/hrm/employees/${employeeId}/unlink-account`);
    },
})