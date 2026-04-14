import { PermissionCode } from "./codes.config";

export interface BasePermission {
    code: string;
}

export interface Permission extends BasePermission {
    lvl: number;
    criticality: number;
    allow_expired: boolean;
    available?: boolean;
}

export interface PermissionMeta {
    code: PermissionCode;
    title: string;
    description: string;
    module: string;
    category?: string;
}

export interface PermissionDetail extends Permission {
    meta: PermissionMeta;
}