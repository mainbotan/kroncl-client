import { PaginationMeta } from "@/apps/shared/pagination/types";
import { Employee } from "../hrm/types";
import { ClientDetail } from "@/apps/company/modules/crm/types";
import { CatalogUnit, StockPosition } from "@/apps/company/modules/wm/types";

// --------
// DEAL TYPES
// --------

export interface DealType {
    id: string;
    name: string;
    comment: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateDealTypeRequest {
    name: string;
    comment?: string | null;
}

export interface UpdateDealTypeRequest {
    name?: string;
    comment?: string | null;
}

export interface GetDealTypesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface DealTypesResponse {
    deal_types: DealType[];
    pagination: PaginationMeta;
}

// --------
// DEAL STATUSES
// --------

export interface DealStatus {
    id: string;
    name: string;
    comment: string | null;
    sort_order: number;
    is_default: boolean;
    color: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateDealStatusRequest {
    name: string;
    comment?: string | null;
    sort_order: number;
    color?: string | null;
    is_default?: boolean;
}

export interface UpdateDealStatusRequest {
    name?: string;
    comment?: string | null;
    sort_order?: number;
    color?: string | null;
    is_default?: boolean;
}

export interface GetDealStatusesParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface DealStatusesResponse {
    statuses: DealStatus[];
    pagination: PaginationMeta;
}

// --------
// DEAL POSITIONS
// --------

export interface DealPosition {
    id: string;
    name: string;
    comment: string | null;
    price: number;
    quantity: number;
    unit: string;
    unit_id: string | null;
    position_id: string | null;
    created_at: string;
    updated_at: string;

    // Вложенные сущности
    catalog_unit: CatalogUnit | null;
    catalog_position: StockPosition | null;
}

// --------
// DEALS
// --------

export interface Deal {
    id: string;
    comment: string | null;
    type_id: string | null;
    created_at: string;
    updated_at: string;

    // Вложенные сущности
    client_id: string | null;
    client: ClientDetail | null;
    employees: Employee[];
    status: DealStatus | null;
    type: DealType | null;
}

export interface DealWithPositions extends Deal {
    positions: DealPosition[];
}

export interface CreateDealRequest {
    comment?: string | null;
    type_id?: string | null;
}

export interface UpdateDealPosition {
    id?: string;           // для существующих позиций
    name?: string;          // для новых или обновления
    comment?: string | null;
    price?: number;
    quantity?: number;
    unit?: string;
    unit_id?: string | null;
    position_id?: string | null;
    delete?: boolean;       // true - удалить позицию
}

export interface UpdateDealRequest {
    comment?: string | null;
    type_id?: string | null;
    client_id?: string | null;
    status_id?: string | null;
    employees?: string[];      // полная замена списка сотрудников
    positions?: UpdateDealPosition[];
}

export interface GetDealsParams {
    page?: number;
    limit?: number;
    type_id?: string;
    status_id?: string;
    client_id?: string;
    employee_id?: string;
    search?: string;
    group_by?: 'status';  // группировка по статусам
}

export interface DealsResponse {
    deals: Deal[];
    pagination: PaginationMeta;
}

// --------
// DEALS GROUPED
// --------

export interface DealGroup {
    status_id: string;
    status_name: string;
    status_color: string | null;
    sort_order: number;
    deals: Deal[];
    count: number;
}

export interface DealTransactionsSummary {
    total_amount: number;
    income_amount: number;
    expense_amount: number;
    income_count: number;
    expense_count: number;
    total_count: number;
}

// ----------
// ANALYSIS
// ----------

export interface AnalysisParams {
    start_date?: string;
    end_date?: string;
    type_id?: string;
    status_id?: string;
    client_id?: string;
    employee_id?: string;
}

export interface GroupedAnalysisParams extends AnalysisParams {
    group_by: 'type' | 'status' | 'employee' | 'client' | 'day' | 'month' | 'year';
}

export interface DealAnalysisSummary {
    total_deals: number;
    default_status_id: string | null;
    default_status_name: string | null;
    deals_in_default: number;
    avg_deal_amount: number | null;
}

export interface GroupedStats {
    group_key: string;
    group_name: string;
    count: number;
}