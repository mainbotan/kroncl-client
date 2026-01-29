'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { accountAuth } from '@/apps/account/auth/api';
import Spinner from '@/assets/ui-kit/spinner/spinner';

export default function RefreshPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/platform';
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const refreshAndRedirect = async () => {
            try {
                console.log('🔄 Пробуем refresh токена...');
                const result = await accountAuth.refreshTokens();
                
                if (result?.status) {
                    console.log('✅ Токен обновлен, редирект на:', redirectTo);
                    
                    setTimeout(() => {
                        router.push(redirectTo);
                    }, 100);
                } else {
                    console.log('❌ Refresh не удался, редирект на логин');
                    setError('Не удалось обновить сессию');
                    
                    setTimeout(() => {
                        router.push('/sso/sign_in');
                    }, 2000);
                }
            } catch (error) {
                console.error('❌ Ошибка при refresh:', error);
                setError('Произошла ошибка');
                
                setTimeout(() => {
                    router.push('/sso/sign_in');
                }, 2000);
            }
        };

        refreshAndRedirect();
    }, [router, redirectTo]);

    if (error) {
        return (
            <div style={{
                display: 'flex',
                flex: '1',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Spinner />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flex: '1',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Spinner />
        </div>
    );
}