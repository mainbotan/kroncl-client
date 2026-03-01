import { PaginationParams } from "@/apps/shared/pagination/types";
import { CompanyApi } from "../../api";
import { GetLogsRequest, Log, LogsResponse } from "./types";

export const logsModule = (companyApi: CompanyApi) => ({
    async getLogs(
        params?: PaginationParams & GetLogsRequest
    ) {
        return companyApi.get<LogsResponse>("/modules/logs", {
            params: params as Record<string, string | number | boolean | undefined>
        });
    },
    async getLog(id: string) {
        return companyApi.get<Log>(`/modules/logs/${id}`)
    }
});