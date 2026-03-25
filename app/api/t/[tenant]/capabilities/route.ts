import { NextResponse } from "next/server";
import { getTenantCapabilitiesBySlug } from "@/lib/capabilities";
import { resolveTenantAccess } from '@/lib/tenant-access';

export async function GET(_: Request, { params }: { params: Promise<{ tenant: string }> }) {
  try {
    const { tenant: tenantSlug } = await params;
    const access = await resolveTenantAccess({ slug: tenantSlug, allowDemoRead: true });
    if ('error' in access) return access.error;

    const capabilities = await getTenantCapabilitiesBySlug(tenantSlug);

    if (!capabilities) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, capabilities });
  } catch (error) {
    console.error("GET /capabilities error", error);
    return NextResponse.json({
      ok: true,
      capabilities: {
        canUseReports: false,
        canUseFinance: false,
        canUseAdvancedIntegrations: false,
        upgradeRecommended: true,
        plan: "demo",
        planStatus: "DEMO",
      },
    });
  }
}
