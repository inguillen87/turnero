import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /demo (if demo mode is on)
  if (pathname.startsWith('/demo') && process.env.DEMO_MODE === '1') {
    return NextResponse.next();
  }

  // Allow /api routes for now (basic security later)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Super Admin protection
  if (pathname.startsWith('/sa')) {
    // Check if user is Super Admin (mocked for now)
    // In real app: verify session token claims
    // if (!isSuperAdmin) return NextResponse.redirect(new URL('/login', request.url));
  }

  // Tenant protection
  if (pathname.startsWith('/t/')) {
    // Extract slug from /t/[slug]/...
    // const slug = pathname.split('/')[2];
    // Verify user has access to this tenant
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
