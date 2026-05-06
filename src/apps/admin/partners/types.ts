import { PaginationMeta } from '@/apps/shared/pagination/types';

export type PartnerStatus = 'success' | 'waiting' | 'banned';
export type PartnerType = 'public' | 'private';

export interface IncomingPartner {
    id: string;
    name: string;
    type: PartnerType;
    text: string | null;
    email: string;
    status: PartnerStatus;
    created_at: string;
    updated_at: string;
}

export interface GetPartnersResponse {
    partners: IncomingPartner[];
    pagination: PaginationMeta;
}

export interface UpdatePartnerRequest {
    name?: string;
    type?: PartnerType;
    text?: string | null;
    email?: string;
    status?: PartnerStatus;
}