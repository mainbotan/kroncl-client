'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import { adminApi } from '../api';
import { AdminAccount } from '../types';

interface AdminContextType {
    isAdmin: boolean;
    adminLevel: number;
    adminUser: AdminAccount | null;
    loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();
    const [adminUser, setAdminUser] = useState<AdminAccount | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLevel, setAdminLevel] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (status === 'loading') return;

            if (status === 'unauthenticated' || !user) {
                setIsAdmin(false);
                setAdminLevel(0);
                setAdminUser(null);
                setLoading(false);
                return;
            }

            // Если уже есть флаг в user
            if (user.is_admin && user.admin_level) {
                setIsAdmin(true);
                setAdminLevel(user.admin_level);
                setAdminUser(user as AdminAccount);
                setLoading(false);
                return;
            }

            // Проверяем через API
            const result = await adminApi.checkAdminAccess();
            setIsAdmin(result.is_admin);
            setAdminLevel(result.admin_level);

            if (result.is_admin) {
                const profile = await adminApi.getAdminProfile();
                setAdminUser(profile);
            }

            setLoading(false);
        };

        checkAdmin();
    }, [user, status]);

    return (
        <AdminContext.Provider value={{ isAdmin, adminLevel, adminUser, loading }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
}