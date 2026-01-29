import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    const accessToken = request.cookies.get('auth_access_token')?.value;
    const refreshToken = request.cookies.get('auth_refresh_token')?.value;
    
    const protectedPaths = ['/platform'];
    const isProtected = protectedPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
    );
    
    // перевыпуск токенов
    if (pathname === '/platform/refresh') {
        return NextResponse.next();
    }
    
    if (isProtected) {
        if (!accessToken) {
            if (!refreshToken) {
                const loginUrl = new URL('/sso/sign_in', request.url);
                return NextResponse.redirect(loginUrl);
            }
            
            const refreshUrl = new URL('/platform/refresh', request.url);
            refreshUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(refreshUrl);
        }
        
        // проверка валидности
        try {
            const parts = accessToken.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token format');
            }
            
            const payload = JSON.parse(atob(parts[1]));
            const exp = payload.exp * 1000;
            const now = Date.now();
            
            const bufferTime = 5 * 60 * 1000;
            
            if (exp < now - bufferTime) {
                console.log('Token expired or expiring soon, redirecting to refresh...');
                
                if (refreshToken) {
                    const refreshUrl = new URL('/platform/refresh', request.url);
                    refreshUrl.searchParams.set('redirect', pathname);
                    return NextResponse.redirect(refreshUrl);
                } else {
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
    
    if (pathname === '/sso/sign_in' && accessToken) {
        try {
            const parts = accessToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                const exp = payload.exp * 1000;
                const now = Date.now();
                const bufferTime = 5 * 60 * 1000;
                
                if (exp > now + bufferTime) {
                    const platformUrl = new URL('/platform', request.url);
                    return NextResponse.redirect(platformUrl);
                }
            }
        } catch {
            
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