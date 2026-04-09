export interface Permission {
    code: string;
    lvl: number;
    criticality: number;
    allow_expired: boolean;
    available?: boolean;
}

export interface AccountPermission {
    code: string;
}