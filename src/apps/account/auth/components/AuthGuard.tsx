'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sso/sign_in');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div style={{display: "flex", flex: "1", alignItems: "center", justifyContent: "center"}}><Spinner /></div>
        )
    }

    if (status === 'authenticated') {
        return <>{children}</>;
    }

    return null;
}