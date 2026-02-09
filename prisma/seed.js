const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Tenant
  const tenantSlug = 'demo-clinica';

  // Clean up if exists
  const existing = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (existing) {
      console.log('⚠️ Tenant already exists. Skipping or you might want to force delete.');
      // For now, we assume clean slate or we just return.
      // In a real seed script, we might delete everything related to this tenant first.
      return;
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Clínica Demo Central',
      slug: tenantSlug,
      status: 'active',
      planId: 'pro-plan',
    },
  });

  console.log(`✅ Tenant created: ${tenant.name} (${tenant.id})`);

  // 2. Create Users
  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      hashedPassword: '$2a$10$YourHashedPasswordHere', // Use a real hash in production
      name: 'Admin Demo',
      role: 'OWNER',
      tenantId: tenant.id,
    },
  });

  // 3. Create Locations
  const loc1 = await prisma.location.create({
    data: { name: 'Sede Centro', address: 'Av. Corrientes 1234', tenantId: tenant.id },
  });
  const loc2 = await prisma.location.create({
    data: { name: 'Sede Norte', address: 'Libertador 5600', tenantId: tenant.id },
  });

  // 4. Create Professionals
  const pro1 = await prisma.professional.create({
    data: { name: 'Dr. Juan Pérez', specialty: 'Cardiología', tenantId: tenant.id },
  });
  const pro2 = await prisma.professional.create({
    data: { name: 'Dra. Ana Gómez', specialty: 'Dermatología', tenantId: tenant.id },
  });
  const pro3 = await prisma.professional.create({
    data: { name: 'Lic. Pedro Lopez', specialty: 'Kinesiología', tenantId: tenant.id },
  });

  // 5. Create Services
  const serv1 = await prisma.service.create({
    data: { name: 'Consulta General', durationMin: 30, price: 5000, tenantId: tenant.id },
  });
  const serv2 = await prisma.service.create({
    data: { name: 'Limpieza Facial', durationMin: 60, price: 12000, tenantId: tenant.id },
  });
  const serv3 = await prisma.service.create({
    data: { name: 'Sesión Kinesiología', durationMin: 45, price: 4500, tenantId: tenant.id },
  });

  // 6. Create Availability Rules (Simple 9-17 Mon-Fri)
  await prisma.availabilityRule.create({
    data: { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', professionalId: pro1.id, tenantId: tenant.id },
  });

  // 7. Create Demo Appointments (30 in the future/past)
  const now = new Date();

  // Past appointment (Done)
  await prisma.appointment.create({
    data: {
      startAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // yesterday
      endAt: new Date(now.getTime() - 23 * 60 * 60 * 1000),
      status: 'done',
      serviceId: serv1.id,
      professionalId: pro1.id,
      clientName: 'Roberto Carlos',
      clientPhone: '+5491112345678',
      tenantId: tenant.id,
    }
  });

  // Future appointment (Confirmed)
  await prisma.appointment.create({
    data: {
      startAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // in 2 hours
      endAt: new Date(now.getTime() + 2.5 * 60 * 60 * 1000),
      status: 'confirmed',
      serviceId: serv2.id,
      professionalId: pro2.id,
      clientName: 'María Becerra',
      clientPhone: '+5491198765432',
      tenantId: tenant.id,
    }
  });

   // Future appointment (Pending)
   await prisma.appointment.create({
    data: {
      startAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // tomorrow
      endAt: new Date(now.getTime() + 25 * 60 * 60 * 1000),
      status: 'pending',
      serviceId: serv3.id,
      professionalId: pro3.id,
      clientName: 'Lionel Messi',
      clientPhone: '+5491110101010',
      tenantId: tenant.id,
    }
  });

  console.log('🎉 Seeding complete. Demo clinic ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
