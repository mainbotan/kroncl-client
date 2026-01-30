import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { 
  CreateCompanyRequest, 
  Company,
  CheckSlugUniqueRequest,
  SlugUniqueData,
  Storage,
  StorageStatus
} from './types';

class CompanyInitApi {
  private endpoints = {
    create: '/companies',
    checkSlug: '/companies/check-slug-unique',
    storage: (companyId: string) => `/companies/${companyId}/storage`,
  };

  /**
   * Создание новой компании
   */
  async createCompany(data: CreateCompanyRequest): Promise<ApiResponse<Company>> {
    return api.post<Company>(this.endpoints.create, data);
  }

  /**
   * Получение информации о хранилище компании
   */
  async getCompanyStorage(companyId: string): Promise<ApiResponse<Storage>> {
    return api.get<Storage>(this.endpoints.storage(companyId));
  }

  /**
   * Проверка уникальности slug
   */
  async checkSlugUnique(params: CheckSlugUniqueRequest): Promise<ApiResponse<SlugUniqueData>> {
    return api.get<SlugUniqueData>(this.endpoints.checkSlug, {
      params: {
        slug: params.slug
      }
    });
  }

  /**
   * Дебаунсированная проверка slug с кэшированием
   */
  async debouncedCheckSlugUnique(
    slug: string, 
    signal?: AbortSignal
  ): Promise<ApiResponse<SlugUniqueData> | null> {
    if (!slug || slug.length < 2) {
      return null;
    }

    try {
      const response = await api.get<SlugUniqueData>(this.endpoints.checkSlug, {
        params: { slug },
        signal
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Запрос проверки slug отменен');
        return null;
      }
      throw error;
    }
  }
}

// Экспортируем singleton instance
export const companyInitApi = new CompanyInitApi();