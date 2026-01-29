import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Получаем токены из cookies
    const accessToken = request.cookies.get('auth_access_token')?.value;
    const refreshToken = request.cookies.get('auth_refresh_token')?.value;
    
    // Защищенные пути
    const protectedPaths = ['/platform'];
    const isProtected = protectedPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
    );
    
    // Если на защищенном пути
    if (isProtected) {
        // Нет access токена
        if (!accessToken) {
            // Нет и refresh токена → на логин
            if (!refreshToken) {
                const loginUrl = new URL('/sso/sign_in', request.url);
                return NextResponse.redirect(loginUrl);
            }
            
            // Есть refresh токен, но нет access токена
            // Пробуем refresh через API (можно сделать через edge function)
            // Или просто редиректим на refresh endpoint
            const refreshUrl = new URL('/api/auth/refresh', request.url);
            refreshUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(refreshUrl);
        }
        
        // Проверяем валидность токена (примерная проверка)
        try {
            // Простая проверка формата JWT
            const parts = accessToken.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }
            
            // Можно добавить проверку exp (expiration) из payload
            const payload = JSON.parse(atob(parts[1]));
            const exp = payload.exp * 1000; // конвертируем в мс
            const now = Date.now();
            
            // Если токен истек
            if (exp < now) {
                console.log('Token expired, trying to refresh...');
                
                // Если есть refresh токен, пробуем обновить
                if (refreshToken) {
                    const refreshUrl = new URL('/api/auth/refresh', request.url);
                    refreshUrl.searchParams.set('redirect', pathname);
                    return NextResponse.redirect(refreshUrl);
                } else {
                    // Нет refresh токена → на логин
                    const loginUrl = new URL('/sso/sign_in', request.url);
                    return NextResponse.redirect(loginUrl);
                }
            }
        } catch (error) {
            console.error('Token validation error:', error);
            const loginUrl = new URL('/sso/sign_in', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }
    
    // Если на странице логина и есть валидный токен → на платформу
    if (pathname === '/sso/sign_in' && accessToken) {
        try {
            // Простая проверка токена
            const parts = accessToken.split('.');
            if (parts.length === 3) {
                const platformUrl = new URL('/platform', request.url);
                return NextResponse.redirect(platformUrl);
            }
        } catch {
            // Токен невалидный, остаемся на странице логина
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/platform/:path*',
        '/sso/sign_in',
    ],
};