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
export type TrackedType = 'fifo' | 'lifo';
export type CurrencyType = 'RUB';

export interface CatalogUnit {
    id: string;
    name: string;
    comment: string | null;
    type: UnitType;
    status: UnitStatus;
    inventory_type: InventoryType;
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
    category_id?: string;
    search?: string;
}

export interface UnitsResponse {
    units: CatalogUnit[];
    pagination: PaginationMeta;
}

// --------
// UNIT-CATEGORY LINKS
// --------

export interface UnitCategoryLink {
    id: string;
    unit_id: string;
    category_id: string;
    created_at: string;
    updated_at: string;
}