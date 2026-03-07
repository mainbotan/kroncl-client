import { CompanyApi } from "../../api";
import {
    // Categories
    CatalogCategory,
    CategoriesResponse,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    GetCategoriesParams,
    // Units
    CatalogUnit,
    UnitsResponse,
    CreateUnitRequest,
    UpdateUnitRequest,
    GetUnitsParams,
    // Unit-Category Links
    UnitCategoryLink
} from "./types";

export const wmModule = (companyApi: CompanyApi) => ({
    // --------
    // CATEGORIES
    // --------
    
    async getCategories(
        params?: GetCategoriesParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.page !== undefined) queryParams.page = params.page;
            if (params.limit !== undefined) queryParams.limit = params.limit;
            if (params.status !== undefined) queryParams.status = params.status;
            if (params.parent_id !== undefined) {
                queryParams.parent_id = params.parent_id === null ? undefined : params.parent_id;
            }
            if (params.search !== undefined) queryParams.search = params.search;
        }
        
        return companyApi.get<CategoriesResponse>("/modules/wm/catalog/categories", {
            params: queryParams
        });
    },
    
    async getCategory(id: string) {
        return companyApi.get<CatalogCategory>(`/modules/wm/catalog/categories/${id}`);
    },
    
    async createCategory(data: CreateCategoryRequest) {
        return companyApi.post<CatalogCategory>("/modules/wm/catalog/categories", data);
    },
    
    async updateCategory(id: string, data: UpdateCategoryRequest) {
        return companyApi.patch<CatalogCategory>(`/modules/wm/catalog/categories/${id}`, data);
    },
    
    async activateCategory(id: string) {
        return companyApi.post<CatalogCategory>(`/modules/wm/catalog/categories/${id}/activate`);
    },
    
    async deactivateCategory(id: string) {
        return companyApi.post<CatalogCategory>(`/modules/wm/catalog/categories/${id}/deactivate`);
    },

    // --------
    // UNITS
    // --------
    
    async getUnits(
        params?: GetUnitsParams
    ) {
        const queryParams: Record<string, string | number | boolean | undefined> = {};
        
        if (params) {
            if (params.page !== undefined) queryParams.page = params.page;
            if (params.limit !== undefined) queryParams.limit = params.limit;
            if (params.type !== undefined) queryParams.type = params.type;
            if (params.status !== undefined) queryParams.status = params.status;
            if (params.inventory_type !== undefined) queryParams.inventory_type = params.inventory_type;
            if (params.category_id !== undefined) {
                queryParams.category_id = params.category_id === null ? undefined : params.category_id;
            }
            if (params.search !== undefined) queryParams.search = params.search;
        }
        
        return companyApi.get<UnitsResponse>("/modules/wm/catalog/units", {
            params: queryParams
        });
    },
    
    async getUnit(id: string) {
        return companyApi.get<CatalogUnit>(`/modules/wm/catalog/units/${id}`);
    },
    
    async createUnit(data: CreateUnitRequest) {
        return companyApi.post<CatalogUnit>("/modules/wm/catalog/units", data);
    },
    
    async updateUnit(id: string, data: UpdateUnitRequest) {
        return companyApi.patch<CatalogUnit>(`/modules/wm/catalog/units/${id}`, data);
    },
    
    async activateUnit(id: string) {
        return companyApi.post<CatalogUnit>(`/modules/wm/catalog/units/${id}/activate`);
    },
    
    async deactivateUnit(id: string) {
        return companyApi.post<CatalogUnit>(`/modules/wm/catalog/units/${id}/deactivate`);
    },

    // --------
    // UNIT-CATEGORY LINKS
    // --------
    
    async getUnitCategoryLinks(unitId: string) {
        return companyApi.get<UnitCategoryLink[]>(`/modules/wm/catalog/units/${unitId}/categories`);
    },
    
    async linkUnitToCategory(unitId: string, categoryId: string) {
        return companyApi.post<UnitCategoryLink>(`/modules/wm/catalog/units/${unitId}/categories/${categoryId}`);
    },
    
    async unlinkUnitFromCategory(unitId: string, categoryId: string) {
        return companyApi.delete<void>(`/modules/wm/catalog/units/${unitId}/categories/${categoryId}`);
    }
});