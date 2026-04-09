import { prisma } from "@/lib/db";

export type TenantCapabilities = {
  canUseReports: boolean;
  canUseFinance: boolean;
  canUseAdvancedIntegrations: boolean;
  upgradeRecommended: boolean;
  plan: string;
  planStatus: string;
};

export async function getTenantCapabilitiesBySlug(slug: string): Promise<TenantCapabilities | null> {
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { plan: true, planStatus: true },
  });

  if (!tenant) return null;

  const normalizedPlan = (tenant.plan || "demo").toLowerCase();
  const normalizedStatus = (tenant.planStatus || "DEMO").toUpperCase();

  const isActive = normalizedStatus === "ACTIVE";
  const isEnterprise = normalizedPlan === "enterprise";

  return {
    canUseReports: isActive || isEnterprise,
    canUseFinance: isActive || isEnterprise,
    canUseAdvancedIntegrations: isActive,
    upgradeRecommended: !isActive,
    plan: tenant.plan,
    planStatus: tenant.planStatus,
  };
}
