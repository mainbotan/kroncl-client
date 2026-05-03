'use client';

import { useAdmin } from './context/AdminContext';

interface AdminLevelChecker {
    allowed: boolean;
    isLoading: boolean;
    level: number;
}

export function useAdminLevel(requiredLevel: number): AdminLevelChecker {
    const { adminLevel, isAdmin, loading } = useAdmin();

    if (loading) {
        return { allowed: false, isLoading: true, level: 0 };
    }

    return {
        allowed: isAdmin && adminLevel >= requiredLevel,
        isLoading: false,
        level: adminLevel,
    };
}

export function isAdminAllowed(checker: AdminLevelChecker): boolean {
    return !checker.isLoading && checker.allowed;
}