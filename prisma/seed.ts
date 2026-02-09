import { PrismaClient, GlobalRole, TenantRole, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Jules Schema...');

  const slug = 'demo-clinica';

  // 1. Create Tenant (or upsert)
  const tenant = await prisma.tenant.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      name: 'Clínica Demo Central',
      plan: 'pro-demo',
      status: 'active',
    },
  });

  console.log(`✅ Tenant: ${tenant.name} (${tenant.id})`);

  // 2. Create Users (Super Admin + Tenant Users)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'super@turnero.com' },
    update: {},
    create: {
      email: 'super@turnero.com',
      name: 'Super Admin',
      passwordHash: '$2a$12$R9h/cIPz0gi.URNNXRfuowZn8...hash...', // Mock hash
      globalRole: GlobalRole.SUPER_ADMIN,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin Demo',
      passwordHash: '$2a$12$R9h/cIPz0gi.URNNXRfuowZn8...hash...',
      globalRole: GlobalRole.USER,
    },
  });

  // Link Owner to Tenant
  await prisma.tenantUser.upsert({
    where: {
      tenantId_userId: { tenantId: tenant.id, userId: owner.id },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      userId: owner.id,
      role: TenantRole.OWNER,
    },
  });

  // 3. Create Services (8)
  const serviceNames = [
    { name: 'Consulta General', min: 30, price: 5000 },
    { name: 'Limpieza Facial', min: 60, price: 12000 },
    { name: 'Masaje Descontracturante', min: 45, price: 8000 },
    { name: 'Blanqueamiento Dental', min: 60, price: 25000 },
    { name: 'Extracción Simple', min: 45, price: 15000 },
    { name: 'Consulta Nutrición', min: 30, price: 6000 },
    { name: 'Depilación Láser (Zona Chica)', min: 15, price: 4000 },
    { name: 'Depilación Láser (Cuerpo Completo)', min: 90, price: 30000 },
  ];

  const services = [];
  for (const s of serviceNames) {
    const serv = await prisma.service.create({
      data: {
        tenantId: tenant.id,
        name: s.name,
        durationMin: s.min,
        priceCents: s.price * 100, // Stored in cents
      },
    });
    services.push(serv);
  }

  // 4. Create Professionals (3)
  const proNames = [
    { name: 'Dr. Juan Pérez', spec: 'General' },
    { name: 'Dra. Ana Gómez', spec: 'Estética' },
    { name: 'Lic. Pedro López', spec: 'Kinesiología' },
  ];

  const pros = [];
  for (const p of proNames) {
    const pro = await prisma.professional.create({
      data: {
        tenantId: tenant.id,
        name: p.name,
        specialty: p.spec,
      },
    });
    pros.push(pro);
  }

  // 5. Create Customers (20)
  const customerNames = [
    'Lionel Messi', 'Roberto Carlos', 'María Becerra', 'Duki', 'Tini Stoessel',
    'Charly García', 'Fito Páez', 'Gustavo Cerati', 'Luis Spinetta', 'Mercedes Sosa',
    'Jorge Luis Borges', 'Julio Cortázar', 'Ernesto Sabato', 'Alfonsina Storni', 'Victoria Ocampo',
    'René Favaloro', 'Bernardo Houssay', 'Luis Leloir', 'César Milstein', 'Adolfo Pérez Esquivel'
  ];

  const customers = [];
  for (const name of customerNames) {
    const c = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        name,
        email: `${name.toLowerCase().replace(/ /g, '.')}@gmail.com`,
        phone: '+54911' + Math.floor(Math.random() * 90000000 + 10000000),
      },
    });
    customers.push(c);
  }

  // 6. Create Appointments (30)
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const randomPro = pros[Math.floor(Math.random() * pros.length)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];

    // Spread over -5 to +10 days
    const dayOffset = Math.floor(Math.random() * 15) - 5;
    const hour = 9 + Math.floor(Math.random() * 9); // 9 to 18

    const startAt = new Date(now);
    startAt.setDate(startAt.getDate() + dayOffset);
    startAt.setHours(hour, 0, 0, 0);

    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + randomService.durationMin);

    let status = AppointmentStatus.CONFIRMED;
    if (dayOffset < 0) status = AppointmentStatus.DONE;
    if (dayOffset > 5) status = AppointmentStatus.PENDING;
    if (Math.random() > 0.9) status = AppointmentStatus.CANCELLED;

    await prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        customerId: randomCustomer.id,
        professionalId: randomPro.id,
        serviceId: randomService.id,
        startAt,
        endAt,
        status,
        notes: Math.random() > 0.7 ? 'Nota clínica de prueba.' : null,
      },
    });
  }

  console.log('🎉 Seeding complete. 30 appointments created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
