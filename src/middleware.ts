import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isProduction = process.env.ENV === 'production'; // || process.env.NODE_ENV === 'production';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    if (!isProduction) {
        return NextResponse.next();
    }
    
    const refreshToken = request.cookies.get('refresh_token')?.value;
    
    const protectedPaths = ['/platform'];
    const isProtected = protectedPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
    );
    
    if (pathname === '/platform/refresh') {
        return NextResponse.next();
    }
    
    if (isProtected) {
        if (!refreshToken) {
            const loginUrl = new URL('/sso/sign_in', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }
    
    if (pathname === '/sso/sign_in' && refreshToken) {
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