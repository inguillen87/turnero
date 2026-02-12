import { prisma } from "@/lib/db";
import { RUBROS } from "@/lib/rubros";
import { DEMO_TENANTS } from "@/lib/demo-tenants";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // 1. Seed Demo Tenants
  for (const dt of DEMO_TENANTS) {
    const { tenant, rubros, staff, staff_hours, services, catalog_items, whatsapp_numbers } = dt;

    console.log(`Seeding Tenant: ${tenant.slug}`);

    // Create Tenant
    const t = await prisma.tenant.upsert({
      where: { slug: tenant.slug },
      update: {
        name: tenant.name,
        timezone: tenant.timezone,
        currency: tenant.currency,
        plan: "demo", // Using 'demo' string to map to PlanStatus.DEMO via default or explicit
        defaultLocale: "es-AR"
      },
      create: {
        slug: tenant.slug,
        name: tenant.name,
        timezone: tenant.timezone,
        currency: tenant.currency,
        planStatus: "DEMO",
        defaultLocale: "es-AR"
      }
    });

    // Create Tenant Admin User (One for all demos or one per demo?)
    // Let's create one admin per demo: admin@demo-dentista.com / Demo123!
    const email = `admin@${tenant.slug}.com`;
    const passwordHash = await bcrypt.hash("Demo123!", 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `Admin ${tenant.name}`,
        passwordHash,
        globalRole: "USER"
      }
    });

    // Link User to Tenant
    await prisma.tenantUser.upsert({
      where: { tenantId_userId: { tenantId: t.id, userId: user.id } },
      update: { role: "TENANT_ADMIN" },
      create: { tenantId: t.id, userId: user.id, role: "TENANT_ADMIN" }
    });


    // Create/Update Rubros
    for (const rubroSlug of rubros) {
      const template = RUBROS.find(r => r.slug === rubroSlug);
      if (template) {
        await prisma.tenantRubro.upsert({
          where: { tenantId_slug: { tenantId: t.id, slug: rubroSlug } },
          update: {
            name: template.nombre,
            config: JSON.stringify({
              menu: template.menu_principal,
              politicas: template.politicas,
              datos_reserva: template.datos_reserva,
              demo_quick_prompts: template.demo_quick_prompts,
              emoji: template.emoji,
              tono: template.tono
            })
          },
          create: {
            tenantId: t.id,
            slug: rubroSlug,
            name: template.nombre,
            config: JSON.stringify({
              menu: template.menu_principal,
              politicas: template.politicas,
              datos_reserva: template.datos_reserva,
              demo_quick_prompts: template.demo_quick_prompts,
              emoji: template.emoji,
              tono: template.tono
            })
          }
        });
      }
    }

    // Seed Staff
    for (const s of staff) {
        const createdStaff = await prisma.staff.create({
             data: {
                 tenantId: t.id,
                 name: s.name,
                 role: s.role,
                 active: true
             }
        });

        // Seed Hours for this Staff
        const hours = staff_hours.filter(h => h.staffName === s.name);
        for (const h of hours) {
             await prisma.availabilityRule.create({
                 data: {
                     tenantId: t.id,
                     staffId: createdStaff.id,
                     dayOfWeek: h.dow,
                     startTime: h.start,
                     endTime: h.end
                 }
             });
        }
    }

    // Seed Services
    for (const svc of services) {
        // Find existing to avoid duplicates if re-running
        const exists = await prisma.service.findFirst({
            where: { tenantId: t.id, name: svc.name }
        });

        if (!exists) {
            await prisma.service.create({
                data: {
                    tenantId: t.id,
                    rubroSlug: svc.rubroSlug,
                    name: svc.name,
                    durationMin: svc.durationMin,
                    price: svc.price, // Uses correct Int (e.g. 18000)
                    currency: tenant.currency,
                    active: true
                }
            });
        }
    }

    // Seed Catalog Items
    if (catalog_items) {
        for (const item of catalog_items) {
            const exists = await prisma.catalogItem.findFirst({
                where: { tenantId: t.id, name: item.name }
            });

            if (!exists) {
                await prisma.catalogItem.create({
                     data: {
                         tenantId: t.id,
                         rubroSlug: item.rubroSlug,
                         tipo: item.tipo,
                         name: item.name,
                         category: item.category,
                         price: item.price,
                         currency: item.currency,
                         unit: item.unit,
                         durationMin: item.durationMin,
                         tags: item.tags ? JSON.stringify(item.tags) : undefined,
                         active: true
                     }
                });
            }
        }
    }

    // Seed WhatsApp Numbers (if provided)
    if (whatsapp_numbers) {
        for (const wn of whatsapp_numbers) {
             const exists = await prisma.whatsappNumber.findFirst({
                 where: { toE164: wn.toE164 }
             });

             if (!exists) {
                 // Create a mock integration first if needed, or assume integrationId is optional or created separately.
                 // The schema requires integrationId. Let's create a dummy integration.
                 const integration = await prisma.integration.create({
                     data: {
                         tenantId: t.id,
                         provider: 'twilio_whatsapp',
                         config: JSON.stringify({ sid: 'mock', token: 'mock' }),
                         status: 'active'
                     }
                 });

                 await prisma.whatsappNumber.create({
                     data: {
                         tenantId: t.id,
                         integrationId: integration.id,
                         toE164: wn.toE164,
                         label: wn.label,
                         status: 'active'
                     }
                 });
             }
        }
    }
  }

  // Create Super Admin
  const saEmail = "admin@turnero.pro";
  const saPass = await bcrypt.hash("SuperAdmin123!", 10);
  await prisma.user.upsert({
      where: { email: saEmail },
      update: { globalRole: "SUPER_ADMIN" },
      create: {
          email: saEmail,
          name: "Super Admin",
          passwordHash: saPass,
          globalRole: "SUPER_ADMIN"
      }
  });
  console.log("Seeded Super Admin: admin@turnero.pro");

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
