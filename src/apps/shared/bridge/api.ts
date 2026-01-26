import { ApiResponse, RequestOptions } from './types';

class ApiBridge {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        if (!this.baseUrl) {
            console.warn('NEXT_PUBLIC_API_URL is not defined');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> {
        const { params, headers, ...fetchOptions } = options;

        let url = `${this.baseUrl}${endpoint}`;
        
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }

        // default headers
        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...headers,
        };

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers: defaultHeaders,
            });

            // checking json
            const contentType = response.headers.get('content-type');
            const hasJson = contentType && contentType.includes('application/json');

            if (!response.ok) {
                if (hasJson) {
                    const errorData = await response.json();
                    throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            if (hasJson) {
                const data: ApiResponse<T> = await response.json();
                return data;
            } else {
                throw new Error('Response is not JSON');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred');
            }
        }
    }

    // crud
    get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// singleton instance
export const api = new ApiBridge();