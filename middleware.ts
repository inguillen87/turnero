import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Skip public files and standard nextjs paths
  if (
    url.pathname.startsWith('/demo') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/public') ||
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
      // e.g. /t/slug/dashboard -> /dashboard
      const newPath = '/' + parts.slice(3).join('/');

      // Create new URL with the rewritten path
      const newUrl = new URL(newPath, req.url);
      newUrl.search = url.search; // Preserve query params

      const resp = NextResponse.rewrite(newUrl);
      resp.headers.set('x-tenant-slug', tenant);
      return resp;
    }
  }

  // 2. Subdomain-based tenant (Basic implementation)
  // We assume that if there is a subdomain and it's not 'www' or 'app', it's a tenant.
  // Adjust 'localhost' logic for dev.
  const hostParts = hostname.split('.');
  if (hostname.includes('localhost')) {
     // tenant.localhost:3000
     if (hostParts.length > 1 && hostParts[0] !== 'localhost' && hostParts[0] !== 'www') {
         tenant = hostParts[0];
     }
  } else {
     // Production logic: tenant.domain.com
     // If using vercel.app, usually project-name.vercel.app is the root.
     // So subdomain on vercel.app is tenant.project-name.vercel.app (nested) which is hard.
     // Custom domain is better.
     if (hostParts.length > 2 && hostParts[0] !== 'www') {
         tenant = hostParts[0];
     }
  }

  if (tenant) {
      const resp = NextResponse.next();
      resp.headers.set('x-tenant-slug', tenant);
      return resp;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match everything except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
