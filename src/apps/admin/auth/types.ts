import { Account } from '../../account/types';

export interface AdminCheckResponse {
    is_admin: boolean;
    admin_level: number;
}

export interface AdminAccount extends Account {
    is_admin: boolean;
    admin_level: number;
}

export const ADMIN_LEVEL_1 = 1;
export const ADMIN_LEVEL_2 = 2;
export const ADMIN_LEVEL_3 = 3;
export const ADMIN_LEVEL_4 = 4;
export const ADMIN_LEVEL_5 = 5;
export const ADMIN_MIN_LEVEL = ADMIN_LEVEL_1;
export const ADMIN_MAX_LEVEL = ADMIN_LEVEL_5;