import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const { pathname } = request.nextUrl;

  // Cache headers pentru pagini statice/ISR
  if (pathname === '/' || pathname.startsWith('/listing/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    );
  }
  
  // Cache headers pentru PWA assets
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js'
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=31536000, immutable'
    );
  }
  
  // Cache pentru offline page
  if (pathname === '/offline.html') {
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=43200'
    );
  }
  
  // Evită cache pentru rute de form și admin
  if (
    pathname.startsWith('/new') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/')
  ) {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
