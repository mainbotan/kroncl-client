// обвязка запросов
export interface ApiResponse<T = any> {
    status: boolean;
    message: string;
    data: T;
    _meta: {
        timestamp: string;
        request_id: string;
        path: string;
        method: string;
    }
}

export interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>;
    headers?: Record<string, string>;
}

export interface EmptyResponseData {
    
}