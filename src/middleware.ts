import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Получаем токен из cookies
    const token = request.cookies.get('auth_access_token')?.value;
    
    // Защищенные пути
    const protectedPaths = ['/platform'];
    const isProtected = protectedPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
    );
    
    // Если на защищенном пути и нет токена → на логин
    if (isProtected && !token) {
        const loginUrl = new URL('/sso/sign_in', request.url);
        return NextResponse.redirect(loginUrl);
    }
    
    // Если на странице логина и есть токен → на платформу
    if (pathname === '/sso/sign_in' && token) {
        const platformUrl = new URL('/platform', request.url);
        return NextResponse.redirect(platformUrl);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/platform/:path*',
        '/sso/sign_in',
    ],
};