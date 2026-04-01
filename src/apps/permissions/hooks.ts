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

// Хук для проверки конкретного разрешения
export function usePermission(
    permissionCode: string,
    options?: { allowExpired?: boolean }
) {
    const { companyPlan } = useCompany();
    const { data: permissions = [], isLoading: isPermissionsLoading } = usePermissions();
    
    const allowExpired = options?.allowExpired ?? false;
    
    // Ищем разрешение
    const permission = permissions.find(p => p.code === permissionCode);

    console.log(permission);
    
    // Если разрешение не найдено в списке — запрещаем
    if (!permission) {
        return { allowed: false, isLoading: isPermissionsLoading };
    }
    
    const isExpired = companyPlan?.days_left === 0;
    const currentLvl = companyPlan?.current_plan.lvl ?? 0;
    const requiredLvl = permission.lvl;
    
    const allowed = requiredLvl >= currentLvl;
    if (!allowed) {
        return { allowed: allowed, isLoading: isPermissionsLoading }
    }
    if (isExpired) {
        return { allowed: allowExpired, isLoading: isPermissionsLoading };
    } 
    
    return { allowed, isLoading: isPermissionsLoading };
}