'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '@/apps/account/auth/context/AuthContext';
import Spinner from '@/assets/ui-kit/spinner/spinner';
import { ADMIN_MIN_LEVEL } from '../types';

interface AdminGuardProps {
    children: React.ReactNode;
    requiredLevel?: number;
    redirectTo?: string;
}

export function AdminGuard({ 
    children, 
    requiredLevel = ADMIN_MIN_LEVEL, 
    redirectTo = '/sso/sign_in' 
}: AdminGuardProps) {
    const router = useRouter();
    const { status: authStatus } = useAuth();
    const { isAdmin, adminLevel, loading } = useAdmin();

    useEffect(() => {
        if (authStatus === 'loading' || loading) return;
        
        if (authStatus === 'unauthenticated') {
            router.push(redirectTo);
            return;
        }

        if (!isAdmin) {
            router.push('/platform');
            return;
        }
    }, [authStatus, loading, isAdmin, adminLevel, requiredLevel, redirectTo, router]);

    if (authStatus === 'loading' || loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (authStatus === 'unauthenticated') {
        return null;
    }

    if (!isAdmin) {
        return null;
    }

    if (adminLevel < requiredLevel) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '.45em', lineHeight: '1.3' }}>
                Недостаточно прав
            </div>
        )
    }

    return <>{children}</>;
}