import { PaginationMeta } from "@/apps/shared/pagination/types";

// --------
// CLIENTS
// --------

export type ClientType = 'individual' | 'legal';
export type ClientStatus = 'active' | 'inactive';

export interface Client {
    id: string;
    first_name: string;
    last_name: string | null;
    patronymic: string | null;
    phone: string | null;
    email: string | null;
    comment: string | null;
    type: ClientType;
    status: ClientStatus;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface ClientDetail extends Client {
    source: ClientSource;
}

export interface CreateClientRequest {
    first_name: string;
    last_name?: string | null;
    patronymic?: string | null;
    phone?: string | null;
    email?: string | null;
    comment?: string | null;
    type: ClientType;
    status?: ClientStatus;
    source_id: string;
    metadata?: Record<string, any>;
}

export interface UpdateClientRequest {
    first_name?: string;
    last_name?: string | null;
    patronymic?: string | null;
    phone?: string | null;
    email?: string | null;
    comment?: string | null;
    source_id?: string;
    type?: ClientType;
    status?: ClientStatus;
    metadata?: Record<string, any>;
}

export interface GetClientsParams {
    page?: number;
    limit?: number;
    type?: ClientType;
    status?: ClientStatus;
    search?: string;
    sourceId?: string;
}

export interface ClientsResponse {
    clients: ClientDetail[];
    pagination: PaginationMeta;
}

// --------
// SOURCES
// --------

export type SourceType = 'organic' | 'social' | 'referral' | 'paid' | 'email' | 'other';
export type SourceStatus = 'active' | 'inactive';

export interface ClientSource {
    id: string;
    name: string;
    url: string | null;
    type: SourceType;
    comment: string | null;
    system: boolean;
    status: SourceStatus;
    metadata: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CreateSourceRequest {
    name: string;
    type: SourceType;
    url?: string | null;
    comment?: string | null;
    system?: boolean;
    status?: SourceStatus;  // defaults to active
    metadata?: Record<string, any>;
}

export interface UpdateSourceRequest {
    name?: string;
    url?: string | null;
    type?: SourceType;
    comment?: string | null;
    status?: SourceStatus;
    metadata?: Record<string, any>;
}

export interface GetSourcesParams {
    page?: number;
    limit?: number;
    type?: SourceType;
    status?: SourceStatus;
    system?: boolean;
    search?: string;
}

export interface SourcesResponse {
    sources: ClientSource[];
    pagination: PaginationMeta;
}

// --------
// CLIENT-SOURCE LINKS
// --------

export interface ClientSourceLink {
    id: string;
    client_id: string;
    source_id: string;
    created_at: string;
}