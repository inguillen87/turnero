import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const url = req.nextUrl;

    // Logic for /t/:slug path rewriting
    if (url.pathname.startsWith("/t/")) {
      const parts = url.pathname.split("/"); // ['', 't', 'slug', 'rest...']
      if (parts.length >= 3 && parts[2]) {
        const tenant = parts[2];

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

    return NextResponse.next();
  } catch (e) {
    console.error("Middleware error:", e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // STRICT matcher: Only run on /t/* paths
    "/t/:path*",
  ],
};
