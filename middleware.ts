import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const p = url.pathname;

  // EXCLUDE Twilio Webhooks from Middleware/Auth/Redirects
  if (p === "/whatsapp" || p === "/api/whatsapp" || p === "/api/webhooks/twilio") {
    return NextResponse.next();
  }

  // Basic tenant protection
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
  // We match everything EXCEPT static files to ensure we catch /whatsapp if needed,
  // but usually webhooks don't need middleware unless for auth.
  // However, if the user had a global matcher blocking it, this fixes it.
  matcher: ["/((?!_next|favicon.ico).*)"],
};
