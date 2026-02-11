import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Supported locales
const LOCALES = ["es-AR", "pt-BR", "en-US"] as const;
const DEFAULT_LOCALE = "es-AR";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Exclude API, static files, images
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // crude check for file extensions
  ) {
    return NextResponse.next();
  }

  // 2. Check if pathname already has locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 3. Resolve Tenant Locale (Advanced: check host/subdomain)
  // For now, we assume default or browser preference
  // In a real multi-tenant app, we would look up the tenant by host here
  // and get their defaultLocale from cache/DB.
  // const tenantLocale = await getTenantLocale(req.headers.get("host"));

  const locale = DEFAULT_LOCALE;

  // 4. Redirect to localized path
  // Only redirect if it's a page visit, not internal resource
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except api, static, etc.
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
