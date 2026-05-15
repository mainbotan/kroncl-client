// --------
// CATEGORIES
// --------

import { PaginationMeta } from "@/apps/shared/pagination/types";

export type CategoryStatus = 'active' | 'inactive';

export interface CatalogCategory {
    id: string;
    name: string;
    comment: string | null;
    status: CategoryStatus;
    parent_id: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCategoryRequest {
    name: string;
    comment?: string | null;
    parent_id?: string | null;
    metadata?: Record<string, any>;
}

export interface UpdateCategoryRequest {
    name?: string;
    comment?: string | null;
    parent_id?: string | null;
    status?: CategoryStatus;
    metadata?: Record<string, any>;
}

export interface GetCategoriesParams {
    page?: number;
    limit?: number;
    status?: CategoryStatus;
    parent_id?: string | null;
    search?: string;
}

export interface CategoriesResponse {
    categories: CatalogCategory[];
    pagination: PaginationMeta;
}

// --------
// UNITS
// --------

export type UnitType = 'product' | 'service';
export type UnitStatus = 'active' | 'inactive';
export type InventoryType = 'tracked' | 'untracked';
export type TrackingDetail = 'batch' | 'serial';  // НОВЫЙ ТИП
export type TrackedType = 'fifo' | 'lifo';
export type CurrencyType = 'RUB';

export interface CatalogUnit {
    id: string;
    name: string;
    comment: string | null;
    type: UnitType;
    status: UnitStatus;
    inventory_type: InventoryType;
    tracking_detail?: TrackingDetail | null;  // НОВОЕ ПОЛЕ
    tracked_type: TrackedType | null;
    unit: string;
    sale_price: number;
    purchase_price: number | null;
    currency: CurrencyType;
    category_id: string;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CreateUnitRequest {
    name: string;
    comment?: string | null;
    type: UnitType;
    status?: UnitStatus;
    inventory_type: InventoryType;
    tracking_detail?: TrackingDetail | null;  // НОВОЕ ПОЛЕ
    tracked_type?: TrackedType | null;
    unit: string;
    sale_price: number;
    purchase_price?: number | null;
    currency: CurrencyType;
    category_id: string;
    metadata?: Record<string, any>;
}

export interface UpdateUnitRequest {
    name?: string;
    comment?: string | null;
    type?: UnitType;
    status?: UnitStatus;
    inventory_type?: InventoryType;
    tracking_detail?: TrackingDetail | null;  // НОВОЕ ПОЛЕ
    tracked_type?: TrackedType | null;
    unit?: string;
    sale_price?: number;
    purchase_price?: number | null;
    currency?: CurrencyType;
    category_id?: string | null;
    metadata?: Record<string, any>;
}

export interface GetUnitsParams {
    page?: number;
    limit?: number;
    type?: UnitType;
    status?: UnitStatus;
    inventory_type?: InventoryType;
    tracking_detail?: TrackingDetail;  // НОВЫЙ ПАРАМЕТР ФИЛЬТРАЦИИ
    category_id?: string;
    search?: string;
}

export interface UnitsResponse {
    units: CatalogUnit[];
    pagination: PaginationMeta;
}

// --------
// STOCKS
// --------

export type StockDirection = 'income' | 'outcome';
export type StockPositionType = 'batch' | 'serial';

export interface StockBatch {
    id: string;
    direction: StockDirection;
    comment: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface StockPosition {
    id: string;
    type: StockPositionType;
    unit_id: string;
    quantity: number;
    created_at: string;
}

export interface StockBatchPosition {
    unit_id: string;
    quantity: number;
    price: number;
}

export interface CreateStockBatchRequest {
    direction: StockDirection;
    comment?: string | null;
    positions: StockBatchPosition[];
    metadata?: Record<string, any>;
}

export interface PositionWithUnit {
    id: string;
    type: StockPositionType;
    unit_id: string;
    quantity: number;
    created_at: string;
    batch_id: string;
    unit: CatalogUnit;
}

export interface BatchWithPositions {
    id: string;
    direction: StockDirection;
    comment: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    positions: PositionWithUnit[];
}

export interface CreateStockBatchResponse {
    batch_id: string;
    direction: StockDirection;
    comment: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    positions: PositionWithUnit[];
}

export interface GetStockBatchesParams {
    page?: number;
    limit?: number;
    direction?: StockDirection;
    unit_id?: string;
    search?: string;
}

export interface GetStockPositionsParams {
    page?: number;
    limit?: number;
    type?: StockPositionType;
    unit_id?: string;
    batch_id?: string;
    in_stock?: boolean;
    search?: string;
}

export interface StockBatchesResponse {
    batches: StockBatch[];
    pagination: PaginationMeta;
}

export interface StockPositionsResponse {
    positions: PositionWithUnit[];
    pagination: PaginationMeta;
}

// --------
// STOCK BALANCE
// --------

export interface StockBalanceItem {
    unit_id: string;
    unit_name: string;
    quantity: number;
    reserved: number;
    available: number;
    unit: CatalogUnit;
}