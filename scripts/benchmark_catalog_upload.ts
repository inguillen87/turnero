import { prisma } from "../lib/db";

async function main() {
  console.log("Starting benchmark for catalog upload...");

  // 1. Setup Tenant
  const tenantSlug = "benchmark-tenant-" + Date.now();
  let tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });

  if (!tenant) {
    console.log(`Creating benchmark tenant: ${tenantSlug}`);
    tenant = await prisma.tenant.create({
      data: {
        slug: tenantSlug,
        name: "Benchmark Tenant",
        status: "active",
        plan: "free",
      },
    });
  }

  const itemsCount = 100;
  const items = Array.from({ length: itemsCount }).map((_, i) => ({
    name: `Item ${i}`,
    price: 100 + i,
    category: "Benchmark",
    description: `Description for item ${i}`,
    currency: tenant!.currency,
    tipo: "servicio",
    active: true,
  }));

  // --- Benchmark Loop Method ---
  console.log(`\nBenchmarking LOOP method with ${itemsCount} items...`);
  const startLoop = performance.now();

  for (const item of items) {
    await prisma.catalogItem.create({
      data: {
        tenantId: tenant!.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
        currency: item.currency,
        tipo: item.tipo,
        active: item.active,
      },
    });
  }

  const endLoop = performance.now();
  const loopDuration = endLoop - startLoop;
  console.log(`LOOP method took: ${loopDuration.toFixed(2)} ms`);

  // Cleanup
  await prisma.catalogItem.deleteMany({ where: { tenantId: tenant!.id } });

  // --- Benchmark createMany Method ---
  console.log(`\nBenchmarking createMany method with ${itemsCount} items...`);
  const startCreateMany = performance.now();

  await prisma.catalogItem.createMany({
    data: items.map((item) => ({
      tenantId: tenant!.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      currency: item.currency,
      tipo: item.tipo,
      active: item.active,
    })),
  });

  const endCreateMany = performance.now();
  const createManyDuration = endCreateMany - startCreateMany;
  console.log(`createMany method took: ${createManyDuration.toFixed(2)} ms`);

  // Cleanup Tenant
  console.log("\nCleaning up...");
  await prisma.catalogItem.deleteMany({ where: { tenantId: tenant!.id } });
  await prisma.tenant.delete({ where: { id: tenant!.id } });

  console.log("\nBenchmark complete.");

  const improvement = loopDuration / createManyDuration;
  console.log(`Speedup: ${improvement.toFixed(2)}x`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
