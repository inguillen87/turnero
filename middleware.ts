import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // ✅ Skip API & Next internals & public static files
    if (
      url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/demo") ||
      url.pathname === "/favicon.ico" ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/sitemap.xml" ||
      /\.(.*)$/.test(url.pathname) // any file with extension
    ) {
      return NextResponse.next();
    }

    let tenant: string | null = null;

    // 1) Path-based tenant: /t/:slug/...
    if (url.pathname.startsWith("/t/")) {
      const parts = url.pathname.split("/"); // ['', 't', 'slug', 'rest...']
      if (parts.length >= 3 && parts[2]) {
        tenant = parts[2];

        // rewrite: /t/slug/dashboard -> /dashboard
        const rest = parts.slice(3).join("/");
        const newPath = "/" + (rest || "dashboard"); // if /t/slug -> /dashboard

        // We need to rewrite to the new path but keep the tenant context
        const newUrl = req.nextUrl.clone();
        newUrl.pathname = newPath;
        newUrl.search = url.search;

        const resp = NextResponse.rewrite(newUrl);
        resp.headers.set("x-tenant-slug", tenant);
        return resp;
      }
    }

    // 2) Subdomain-based tenant (only custom domain / localhost)
    const hostParts = hostname.split(".");

    if (hostname.includes("localhost")) {
      // tenant.localhost:3000
      if (hostParts.length > 1 && hostParts[0] !== "localhost" && hostParts[0] !== "www") {
        tenant = hostParts[0];
      }
    } else {
      // On vercel.app DO NOT attempt tenant by subdomain unless custom domain
      // Leave disabled for safety on vercel.app subdomains.
      if (!hostname.endsWith("vercel.app")) {
        if (hostParts.length > 2 && hostParts[0] !== "www") {
          tenant = hostParts[0];
        }
      }
    }

    if (tenant) {
      const resp = NextResponse.next();
      resp.headers.set("x-tenant-slug", tenant);
      return resp;
    }

    return NextResponse.next();
  } catch (e) {
    console.error("Middleware error:", e);
    // ✅ fail-open: never crash the site due to middleware
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // ✅ Exclude api, internal assets and static files
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|demo).*)",
  ],
};
