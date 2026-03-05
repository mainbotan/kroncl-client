import { PaginationMeta, PaginationParams } from "@/apps/shared/pagination/types";

// ----------
// FINGERPRINT TYPES
// ----------

export interface Fingerprint {
    id: string;
    status: 'active' | 'inactive';
    expired_at?: string | null;
    created_at: string;
    last_used_at?: string | null;
}

export interface FingerprintListItem extends Fingerprint {
    masked_key: string;  // fp_abc...xyz
}

export interface FingerprintWithKey extends Fingerprint {
    key: string;  // Только при создании!
}

// ----------
// GET LIST
// ----------

export interface GetFingerprintsParams extends PaginationParams {
    status?: 'active' | 'inactive';
    search?: string;  // поиск по id или маске
}

export interface FingerprintsResponse {
    fingerprints: FingerprintListItem[];
    pagination: PaginationMeta;
}

// ----------
// CREATE
// ----------

export interface CreateFingerprintRequest {
    expires_in?: string;  // "30d", "24h", "never" или null
}

export interface CreateFingerprintResponse {
    id: string;
    key: string;  // ПОЛНЫЙ ключ! показывается только один раз
    status: 'active';
    created_at: string;
    expired_at?: string | null;
}

// ----------
// REVOKE
// ----------

export interface RevokeFingerprintResponse {
    success: boolean;  // или пустой объект как в ответе
    revoked_at: string;
}

// ----------
// GET SINGLE (если нужно)
// ----------

export interface FingerprintDetailsResponse extends FingerprintListItem {
    // можно добавить дополнительные поля если нужно
}