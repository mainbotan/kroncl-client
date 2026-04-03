'use client';

import { useQuery } from '@tanstack/react-query';
import { permissionsApi } from './api';
import { Permission } from './types';
import { useCompany } from '../company/provider';

const PERMISSIONS_QUERY_KEY = ['permissions'];

export function usePermissions() {
    return useQuery({
        queryKey: PERMISSIONS_QUERY_KEY,
        queryFn: async () => {
            const response = await permissionsApi.getPermissions();
            if (response.status && response.data) {
                return response.data;
            }
            return [] as Permission[];
        },
        staleTime: 24 * 60 * 60 * 1000, // 24 часа
        gcTime: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
}

export interface Checker {
    allowed: boolean;
    isLoading: boolean;
}

// Хук для проверки конкретного разрешения
export function usePermission(
    permissionCode: string,
    options?: { allowExpired?: boolean }
): Checker {
    const { companyPlan } = useCompany();
    const { data: permissions = [], isLoading: isPermissionsLoading } = usePermissions();
    
    const allowExpired = options?.allowExpired ?? false;
    
    // Ищем разрешение
    const permission = permissions.find(p => p.code === permissionCode);

    console.log(permission);
    
    // Если разрешение не найдено в списке — запрещаем
    if (!permission) {
        return { allowed: true, isLoading: isPermissionsLoading };
        // временно, по-хорошему запрещать если не указано в конфиге
    }
    
    const isExpired = companyPlan?.days_left === 0;
    const currentLvl = companyPlan?.current_plan.lvl ?? 0;
    const requiredLvl = permission.lvl;
    
    const allowed = requiredLvl >= currentLvl;
    if (isExpired) {
        return { allowed: allowExpired, isLoading: isPermissionsLoading };
    } 
    if (!allowed) {
        return { allowed: allowed, isLoading: isPermissionsLoading }
    }
    
    return { allowed, isLoading: isPermissionsLoading };
}

export function isAllowed(checker: Checker): boolean {
    return !checker.isLoading && checker.allowed;
}