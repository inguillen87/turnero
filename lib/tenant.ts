export async function getTenantSlug() {
  return "demo";
}

export async function getTenant() {
  return { id: "demo-tenant-id", slug: "demo", name: "Demo Clinic" };
}
