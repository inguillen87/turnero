import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");

  // Basic tenant protection (if we had sessions here)
  if (url.pathname.startsWith('/t/')) {
    const segments = url.pathname.split('/');
    const tenantSlug = segments[2]; // /t/[slug]/...

    if (!tenantSlug) {
       return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/t/:path*'],
};
