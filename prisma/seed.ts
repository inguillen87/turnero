import { prisma } from "@/lib/db";
import { RUBROS } from "@/lib/rubros"; // Use existing templates if possible, or new JSON

async function main() {
  console.log("Seeding database...");

  // Seed Rubros based on Templates
  // For each template in RUBROS, ensure a demo tenant exists

  const DEMO_TENANTS = [
      { slug: "demo-dentista", name: "Demo Odonto Centro", rubro: "dentista" },
      { slug: "demo-gym", name: "Demo Gym Force", rubro: "gimnasio" },
      { slug: "demo-hotel", name: "Demo Hotel Andes", rubro: "hotel" }
  ];

  for (const t of DEMO_TENANTS) {
      // Create/Update Tenant
      const tenant = await prisma.tenant.upsert({
          where: { slug: t.slug },
          update: { name: t.name },
          create: {
              slug: t.slug,
              name: t.name,
              status: "demo",
              plan: "free",
              defaultLocale: "es-AR"
          }
      });

      // Assign Rubro
      const template = RUBROS.find(r => r.slug === t.rubro);
      if (template) {
          await prisma.tenantRubro.upsert({
              where: {
                  tenantId_slug: { tenantId: tenant.id, slug: t.rubro }
              },
              update: {
                  name: template.name,
                  config: JSON.stringify({
                      menu: template.menu,
                      politicas: template.politicas,
                      datos_reserva: template.datos_reserva
                  })
              },
              create: {
                  tenantId: tenant.id,
                  slug: t.rubro,
                  name: template.name,
                  config: JSON.stringify({
                      menu: template.menu,
                      politicas: template.politicas,
                      datos_reserva: template.datos_reserva
                  })
              }
          });

          // Seed Services
          for (const svc of template.services_default) {
              // Simple check to avoid dups
              const exists = await prisma.service.findFirst({
                  where: { tenantId: tenant.id, name: svc.nombre }
              });
              if (!exists) {
                  await prisma.service.create({
                      data: {
                          tenantId: tenant.id,
                          name: svc.nombre,
                          durationMin: svc.duracion_min,
                          price: svc.precio, // Legacy int
                          priceCents: svc.precio * 100, // Correct cents
                          currency: "ARS",
                          active: true
                      }
                  });
              }
          }
      }

      console.log(`Seeded ${t.slug}`);
  }

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
