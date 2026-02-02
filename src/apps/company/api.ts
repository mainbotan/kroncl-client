import { api } from '@/apps/shared/bridge/api';
import { ApiResponse, RequestOptions } from '@/apps/shared/bridge/types';

export class CompanyApi {
    readonly companyId: string;
    private basePath: string;
    
    constructor(companyId: string) {
        this.companyId = companyId;
        this.basePath = `/companies/${companyId}`;
    }
    
    private async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        endpoint: string,
        options?: RequestOptions
    ): Promise<ApiResponse<T>> {
        try {
            let response: ApiResponse<T>;
            
            switch (method) {
                case 'GET':
                    response = await api.get<T>(`${this.basePath}${endpoint}`, options);
                    break;
                case 'POST':
                    response = await api.post<T>(`${this.basePath}${endpoint}`, options?.body, options);
                    break;
                case 'PUT':
                    response = await api.put<T>(`${this.basePath}${endpoint}`, options?.body, options);
                    break;
                case 'PATCH':
                    response = await api.patch<T>(`${this.basePath}${endpoint}`, options?.body, options);
                    break;
                case 'DELETE':
                    response = await api.delete<T>(`${this.basePath}${endpoint}`, options);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            if (!response.status) {
                this.handleApiError(response, endpoint);
            }
            
            return response;
            
        } catch (error) {
            this.handleRequestError(error, endpoint);
            throw error;
        }
    }
    
    // 401, 403 ....
    private handleApiError(response: ApiResponse<any>, endpoint: string): void {
        console.error(`API Error at ${endpoint}:`, response);
        
        if (response.message?.includes('permission') || response.message?.includes('access')) {
            throw new Error(`Нет прав доступа к ${endpoint}: ${response.message}`);
        }
        
        throw new Error(response.message || `API error: ${endpoint}`);
    }
    
    private handleRequestError(error: any, endpoint: string): void {
        console.error(`Request error at ${endpoint}:`, error);
        
        if (error.message?.includes('Network Error')) {
            throw new Error('Ошибка сети. Проверьте подключение к интернету.');
        }
        
        if (error.message?.includes('401')) {
            throw new Error('Требуется авторизация');
        }
        
        if (error.message?.includes('403')) {
            throw new Error('Доступ запрещен');
        }
        
        throw error;
    }
    
    
    get<T>(endpoint: string = '', options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>('GET', endpoint, options);
    }
    
    post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>('POST', endpoint, {
            ...options,
            body
        });
    }
    
    put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>('PUT', endpoint, {
            ...options,
            body
        });
    }
    
    patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>('PATCH', endpoint, {
            ...options,
            body
        });
    }
    
    delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>('DELETE', endpoint, options);
    }
    
    upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<ApiResponse<T>> {
        return api.post<T>(`${this.basePath}${endpoint}`, formData, {
            ...options,
            headers: {
                ...options?.headers,
            }
        });
    }
}