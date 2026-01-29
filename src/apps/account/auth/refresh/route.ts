import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const redirectTo = searchParams.get('redirect') || '/platform';
    const refreshToken = request.cookies.get('auth_refresh_token')?.value;
    
    if (!refreshToken) {
        // Нет refresh токена → на логин
        const loginUrl = new URL('/sso/sign_in', request.nextUrl.origin);
        return NextResponse.redirect(loginUrl);
    }
    
    try {
        // Вызываем ваш API для refresh токена
        const response = await fetch(`${process.env.API_URL}/account/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Создаем ответ с редиректом
            const redirectResponse = NextResponse.redirect(
                new URL(redirectTo, request.nextUrl.origin)
            );
            
            // Устанавливаем новые cookies
            redirectResponse.cookies.set({
                name: 'auth_access_token',
                value: data.data.access_token,
                path: '/',
                maxAge: 60 * 60 * 24, // 1 день
                sameSite: 'lax',
                httpOnly: true,
            });
            
            redirectResponse.cookies.set({
                name: 'auth_refresh_token',
                value: data.data.refresh_token,
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 дней
                sameSite: 'lax',
                httpOnly: true,
            });
            
            return redirectResponse;
        } else {
            // Refresh не удался → на логин
            const loginUrl = new URL('/sso/sign_in', request.nextUrl.origin);
            const errorResponse = NextResponse.redirect(loginUrl);
            
            // Очищаем cookies
            errorResponse.cookies.delete('auth_access_token');
            errorResponse.cookies.delete('auth_refresh_token');
            
            return errorResponse;
        }
    } catch (error) {
        console.error('Refresh error:', error);
        
        const loginUrl = new URL('/sso/sign_in', request.nextUrl.origin);
        const errorResponse = NextResponse.redirect(loginUrl);
        
        errorResponse.cookies.delete('auth_access_token');
        errorResponse.cookies.delete('auth_refresh_token');
        
        return errorResponse;
    }
}