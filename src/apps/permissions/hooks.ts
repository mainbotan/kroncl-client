'use client';

import { useQuery, useQueries } from '@tanstack/react-query';
import { permissionsApi } from './api';
import { Permission, AccountPermission } from './types';
import { useCompany } from '../company/provider';
import { useAuth } from '@/apps/account/auth/context/AuthContext';

const COMPANY_PERMISSIONS_QUERY_KEY = (companyId: string) => ['company-permissions', companyId];
const ACCOUNT_PERMISSIONS_QUERY_KEY = (companyId: string, accountId: string) => ['account-permissions', companyId, accountId];

export interface Checker {
    allowed: boolean;
    isLoading: boolean;
}

// Хук для получения всех разрешений компании (кэшируются)
export function useCompanyPermissions() {
    const { company } = useCompany();
    const companyId = company?.id;
    
    return useQuery({
        queryKey: COMPANY_PERMISSIONS_QUERY_KEY(companyId),
        queryFn: async () => {
            const response = await permissionsApi.getCompanyPermissions(companyId);
            if (response.status && response.data) {
                return response.data;
            }
            return [] as Permission[];
        },
        enabled: !!companyId,
        staleTime: 24 * 60 * 60 * 1000,
        gcTime: 7 * 24 * 60 * 60 * 1000,
    });
}

// Хук для получения разрешений аккаунта в компании (кэшируются)
export function useAccountPermissions() {
    const { company } = useCompany();
    const { user } = useAuth();
    const companyId = company?.id;
    const accountId = user?.id || '';
    
    return useQuery({
        queryKey: ACCOUNT_PERMISSIONS_QUERY_KEY(companyId, accountId),
        queryFn: async () => {
            const response = await permissionsApi.getAccountPermissions(companyId, accountId);
            if (response.status && response.data) {
                return response.data;
            }
            return [] as AccountPermission[];
        },
        enabled: !!companyId && !!accountId,
        staleTime: 5 * 60 * 1000, // 5 минут, права могут меняться чаще
        gcTime: 10 * 60 * 1000,
    });
}

// Хук для проверки конкретного разрешения
export function usePermission(
    permissionCode: string,
    options?: { allowExpired?: boolean } // форсированные случаи [на бэке запрет на истекший тариф, на фронте надо всё равно показать]
): Checker {
    const { companyPlan } = useCompany();
    
    // Получаем разрешения компании
    const { 
        data: companyPermissions = [], 
        isLoading: isCompanyPermissionsLoading 
    } = useCompanyPermissions();
    
    // Получаем разрешения аккаунта
    const { 
        data: accountPermissions = [], 
        isLoading: isAccountPermissionsLoading 
    } = useAccountPermissions();
    
    // allowExpired из параметра (если передан) — для случаев, когда нужно явно переопределить
    const forceAllowExpired = options?.allowExpired ?? false;
    
    // Находим разрешение в списке компании
    const companyPermission = companyPermissions.find(p => p.code === permissionCode);
    
    // Создаем Set из разрешений аккаунта для быстрой проверки
    const accountPermissionSet = new Set(accountPermissions.map(p => p.code));
    
    const isLoading = isCompanyPermissionsLoading || isAccountPermissionsLoading;
    
    // Если разрешение не найдено в списке компании — запрещаем
    if (!companyPermission) {
        return { allowed: false, isLoading };
    }
    
    const isExpired = companyPlan?.days_left === 0;
    const currentLvl = companyPlan?.current_plan.lvl ?? 0;
    const requiredLvl = companyPermission.lvl;
    
    // Проверка по lvl
    const lvlCheck = requiredLvl >= currentLvl;
    
    // Проверка наличия разрешения у аккаунта
    const hasAccountPermission = accountPermissionSet.has(permissionCode);
    
    // Финальная проверка: должно быть и lvl, и права аккаунта
    if (!lvlCheck || !hasAccountPermission) {
        return { allowed: false, isLoading };
    }
    
    // Проверка истекшего тарифа
    if (isExpired) {
        // Используем allow_expired с бэка, если нет forceAllowExpired
        const expiredAllowed = forceAllowExpired || companyPermission.allow_expired;
        return { allowed: expiredAllowed, isLoading };
    }
    
    return { allowed: true, isLoading };
}

export function isAllowed(checker: Checker): boolean {
    return !checker.isLoading && checker.allowed;
}