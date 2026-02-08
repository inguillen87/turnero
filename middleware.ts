import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Skip public files, nextjs internals, and API routes
    if (
      url.pathname.startsWith('/demo') ||
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/public') ||
      url.pathname.startsWith('/api/') || // Exclude API
      url.pathname === '/favicon.ico'
    ) {
      return NextResponse.next();
    }

    let tenant: string | null = null;
    let isPathBased = false;

    // 1. Path-based tenant: /t/:slug
    if (url.pathname.startsWith('/t/')) {
      const parts = url.pathname.split('/'); // ['', 't', 'slug', 'rest']
      if (parts.length >= 3) {
        tenant = parts[2];
        isPathBased = true;

        // Rewrite URL to remove /t/slug
        const newPath = '/' + parts.slice(3).join('/');
        const newUrl = new URL(newPath, req.url);
        newUrl.search = url.search;

        const resp = NextResponse.rewrite(newUrl);
        resp.headers.set('x-tenant-slug', tenant);
        return resp;
      }
    }

    // 2. Subdomain-based tenant
    // Disable for vercel.app
    if (!hostname.includes('.vercel.app') && !hostname.includes('localhost')) {
       const hostParts = hostname.split('.');
       if (hostParts.length > 2 && hostParts[0] !== 'www') {
           tenant = hostParts[0];
       }
    } else if (hostname.includes('localhost')) {
       // Allow localhost subdomains for testing if needed
       const hostParts = hostname.split('.');
       if (hostParts.length > 1 && hostParts[0] !== 'localhost' && hostParts[0] !== 'www') {
           tenant = hostParts[0];
       }
    }

    if (tenant) {
        const resp = NextResponse.next();
        resp.headers.set('x-tenant-slug', tenant);
        return resp;
    }

    return NextResponse.next();
  } catch (e) {
    console.error('Middleware error:', e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match everything except static files and API
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
