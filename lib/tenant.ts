import { prisma } from "@/lib/db";

export async function getTenantBySlug(slug: string) {
  return await prisma.tenant.findUnique({
    where: { slug },
  });
}
