import prisma from '../src/lib/prisma'

async function main() {
  const password = process.env.INIT_PASSWORD_HASH!

  const response = await Promise.all([
    prisma.users.upsert({
      where: { email: 'rauchg@vercel.com' },
      update: {},
      create: {
        name: 'Guillermo Rauch',
        email: 'rauchg@vercel.com',
        password
      },
    }),
    prisma.users.upsert({
      where: { email: 'lee@vercel.com' },
      update: {},
      create: {
        name: 'Lee Robinson',
        email: 'lee@vercel.com',
        password
      },
    }),
    await prisma.users.upsert({
      where: { email: 'stey@vercel.com' },
      update: {},
      create: {
        name: 'Steven Tey',
        email: 'stey@vercel.com',
        password
      },
    }),
  ])
  console.log(response)
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
