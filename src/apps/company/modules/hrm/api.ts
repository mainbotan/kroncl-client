import { PaginationParams } from "@/apps/shared/pagination/types";
import { CompanyApi } from "../../api";
import { AnalysisParams, CreateEmployeeRequest, Employee, EmployeesResponse, EmployeesSummary, GroupedAnalysisParams, GroupedStats } from "./types";

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
    async deactivateEmployee(id: string) {
        return companyApi.post<Employee>(`/modules/hrm/employees/${id}/deactivate`)
    },
    async activateEmployee(id: string) {
        return companyApi.post<Employee>(`/modules/hrm/employees/${id}/activate`)
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


    // ANALYSIS

    async getAnalysisSummary(params?: AnalysisParams) {
        const queryParams: Record<string, string> = {};
        if (params?.start_date) queryParams.start_date = params.start_date;
        if (params?.end_date) queryParams.end_date = params.end_date;

        return companyApi.get<EmployeesSummary>("/modules/hrm/analysis/summary", {
            params: queryParams as Record<string, string | number | boolean | undefined>,
        });
    },

    async getAnalysisGrouped(params: GroupedAnalysisParams) {
        const queryParams: Record<string, string> = {
            group_by: params.group_by,
        };
        if (params.start_date) queryParams.start_date = params.start_date;
        if (params.end_date) queryParams.end_date = params.end_date;

        return companyApi.get<GroupedStats[]>("/modules/hrm/analysis/grouped", {
            params: queryParams as Record<string, string | number | boolean | undefined>,
        });
    },
})