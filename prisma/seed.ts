import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean up existing data
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availabilityRule.deleteMany();
  await prisma.service.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.location.deleteMany();
  await prisma.tenantUser.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.plan.deleteMany();

  // 1. Create Plans
  const demoPlan = await prisma.plan.create({
    data: {
      name: 'Demo Plan',
      limits: JSON.stringify({ max_users: 10, max_appointments: 100 }),
      features: JSON.stringify(['whatsapp_demo', 'calendar']),
      priceCents: 0,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro Plan',
      limits: JSON.stringify({ max_users: 999, max_appointments: 9999 }),
      features: JSON.stringify(['whatsapp_api', 'calendar', 'reports', 'multi_location']),
      priceCents: 30000, // $300.00
    },
  });

  // 2. Create Users
  const passwordHash = "hashed_secret"; // In real app, use bcrypt

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      name: 'Admin Demo',
      passwordHash,
      globalRole: 'USER',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'recepcion@demo.com',
      name: 'Recepción Demo',
      passwordHash,
      globalRole: 'USER',
    },
  });

  const proUser = await prisma.user.create({
    data: {
      email: 'dr@demo.com',
      name: 'Dr. Demo',
      passwordHash,
      globalRole: 'USER',
    },
  });

  // 3. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      slug: 'demo-clinica',
      name: 'Clínica Demo',
      status: 'active',
      planId: demoPlan.id,
      users: {
        create: [
          { userId: adminUser.id, role: 'OWNER' },
          { userId: staffUser.id, role: 'STAFF' },
          { userId: proUser.id, role: 'PROFESSIONAL' },
        ],
      },
    },
  });

  // 4. Create Locations
  const locCentral = await prisma.location.create({
    data: { tenantId: tenant.id, name: 'Sede Central', address: 'Av. Libertador 1234' },
  });

  const locNorte = await prisma.location.create({
    data: { tenantId: tenant.id, name: 'Sede Norte', address: 'Calle 45 Nro 800' },
  });

  // 5. Create Services
  const servicesData = [
    { name: 'Consulta General', durationMin: 30, priceCents: 5000 },
    { name: 'Limpieza Dental', durationMin: 45, priceCents: 8000 },
    { name: 'Blanqueamiento', durationMin: 60, priceCents: 15000 },
    { name: 'Ortodoncia (Control)', durationMin: 20, priceCents: 4000 },
    { name: 'Implante (Eval)', durationMin: 40, priceCents: 6000 },
    { name: 'Urgencia', durationMin: 30, priceCents: 10000 },
    { name: 'Radiografía', durationMin: 15, priceCents: 3000 },
    { name: 'Consulta Estética', durationMin: 45, priceCents: 7500 },
  ];

  const services = [];
  for (const s of servicesData) {
    services.push(await prisma.service.create({
      data: { ...s, tenantId: tenant.id },
    }));
  }

  // 6. Create Professionals
  const prosData = [
    { name: 'Dr. Juan Pérez', specialty: 'Odontología General' },
    { name: 'Dra. María González', specialty: 'Ortodoncia' },
    { name: 'Dr. Carlos Ruiz', specialty: 'Cirugía' },
  ];

  const professionals = [];
  for (const p of prosData) {
    const pro = await prisma.professional.create({
      data: { ...p, tenantId: tenant.id },
    });
    professionals.push(pro);

    // Add Availability Rules (Mon-Fri 9-17)
    for (let day = 1; day <= 5; day++) {
      await prisma.availabilityRule.create({
        data: {
          tenantId: tenant.id,
          professionalId: pro.id,
          locationId: day % 2 === 0 ? locNorte.id : locCentral.id, // Alternate locations
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          breakStart: '13:00',
          breakEnd: '14:00',
        },
      });
    }
  }

  // 7. Create Customers
  const customersData = [
    { name: 'Ana Garcia', phone: '555-0101', email: 'ana@example.com' },
    { name: 'Luis Rodriguez', phone: '555-0102', email: 'luis@example.com' },
    { name: 'Sofia Martinez', phone: '555-0103', email: 'sofia@example.com' },
    { name: 'Miguel Lopez', phone: '555-0104', email: 'miguel@example.com' },
    { name: 'Lucia Diaz', phone: '555-0105', email: 'lucia@example.com' },
  ];

  const customers = [];
  for (const c of customersData) {
    customers.push(await prisma.customer.create({
      data: { ...c, tenantId: tenant.id },
    }));
  }

  // 8. Create Appointments (Past & Future)
  const now = new Date();
  const statuses = ['PENDING', 'CONFIRMED', 'DONE', 'CANCELLED', 'NO_SHOW'];

  for (let i = 0; i < 30; i++) {
    const randomDayOffset = Math.floor(Math.random() * 14) - 7; // +/- 7 days
    const apptDate = new Date(now);
    apptDate.setDate(now.getDate() + randomDayOffset);
    apptDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);

    const service = services[Math.floor(Math.random() * services.length)];
    const pro = professionals[Math.floor(Math.random() * professionals.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const endDate = new Date(apptDate);
    endDate.setMinutes(endDate.getMinutes() + service.durationMin);

    await prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        professionalId: pro.id,
        serviceId: service.id,
        locationId: locCentral.id, // Simplification
        startAt: apptDate,
        endAt: endDate,
        status: status,
        source: Math.random() > 0.5 ? 'WEB' : 'WHATSAPP',
        notes: Math.random() > 0.7 ? 'Paciente requiere factura A' : null,
      },
    });
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
