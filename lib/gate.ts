// Gatekeeper: Check if tenant has paid plan
import { prisma } from "@/lib/db";

export async function checkPlanGate(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planStatus: true, plan: true }
  });

  if (!tenant) return false;

  // Allow if ACTIVE or if in free DEMO period (assuming 'demo' plan is free forever or limited)
  // If 'planStatus' is DEMO, it's allowed.
  // If 'planStatus' is PENDING, maybe allow restricted access.
  // If 'planStatus' is PAST_DUE or CANCELED, block.

  if (tenant.planStatus === 'ACTIVE' || tenant.planStatus === 'DEMO') {
      return true;
  }

  return false;
}
