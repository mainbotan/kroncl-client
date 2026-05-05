'use client';

import { useAdmin } from './context/AdminContext';
import { useMemo } from 'react';

interface AdminLevelChecker {
    allowed: boolean;
    isLoading: boolean;
    level: number;
}

export function useAdminLevel(requiredLevel: number): AdminLevelChecker {
    const { adminLevel, isAdmin, loading } = useAdmin();

    return useMemo(() => {
        if (loading) {
            return { allowed: false, isLoading: true, level: 0 };
        }

        return {
            allowed: isAdmin && adminLevel >= requiredLevel,
            isLoading: false,
            level: adminLevel,
        };
    }, [adminLevel, isAdmin, loading, requiredLevel]);
}

export function isAdminAllowed(checker: AdminLevelChecker): boolean {
    return !checker.isLoading && checker.allowed;
}