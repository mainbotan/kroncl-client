import { api } from '@/apps/shared/bridge/api';
import { ApiResponse } from '@/apps/shared/bridge/types';
import { 
    GetFingerprintsParams,
    FingerprintsResponse,
    CreateFingerprintRequest,
    CreateFingerprintResponse,
    RevokeFingerprintResponse,
    FingerprintDetailsResponse
} from './types';

export class FingerprintsApi {
    private endpoints = {
        fingerprints: '/account/fingerprints',
        revoke: (id: string) => `/account/fingerprints/${id}/revoke`,
        details: (id: string) => `/account/fingerprints/${id}`,
    };

    /**
     * Получить список ключей с пагинацией
     */
    async getFingerprints(
        params?: GetFingerprintsParams
    ): Promise<ApiResponse<FingerprintsResponse>> {
        const queryParams: Record<string, string> = {};
        
        if (params?.page) queryParams.page = params.page.toString();
        if (params?.limit) queryParams.limit = params.limit.toString();
        if (params?.status) queryParams.status = params.status;
        if (params?.search) queryParams.search = params.search;

        return api.get<FingerprintsResponse>(this.endpoints.fingerprints, {
            params: queryParams
        });
    }

    /**
     * Создать новый ключ
     * @returns Возвращает ПОЛНЫЙ ключ (показывается только один раз!)
     */
    async createFingerprint(
        data?: CreateFingerprintRequest
    ): Promise<ApiResponse<CreateFingerprintResponse>> {
        return api.post<CreateFingerprintResponse>(
            this.endpoints.fingerprints, 
            data || {}  // тело может быть пустым
        );
    }

    /**
     * Отозвать ключ (сделать неактивным)
     */
    async revokeFingerprint(id: string): Promise<ApiResponse<Record<string, never>>> {
        return api.post<Record<string, never>>(this.endpoints.revoke(id));
    }

    /**
     * Получить информацию о конкретном ключе (опционально)
     */
    // async getFingerprintDetails(id: string): Promise<ApiResponse<FingerprintDetailsResponse>> {
    //     return api.get<FingerprintDetailsResponse>(this.endpoints.details(id));
    // }
}

// Синглтон для использования во всем приложении
export const fingerprintsApi = new FingerprintsApi();