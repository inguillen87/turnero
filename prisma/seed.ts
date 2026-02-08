import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await hash('password', 10)

  // Demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'Demo Clinic',
      locale: 'es',
      timezone: 'America/Argentina/Buenos_Aires',
    },
  })

  // User
  const user = await prisma.user.upsert({
    where: { email: 'admin@turnero.com' },
    update: {},
    create: {
      email: 'admin@turnero.com',
      passwordHash,
      role: 'admin',
      name: 'Admin User',
      tenantId: tenant.id,
    },
  })

  console.log({ tenant, user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
