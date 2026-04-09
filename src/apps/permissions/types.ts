export interface BasePermission {
    code: string;
}

export interface Permission extends BasePermission {
    lvl: number;
    criticality: number;
    allow_expired: boolean;
    available?: boolean;
}