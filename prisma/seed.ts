import prisma from '../src/lib/prisma'

async function main() {
  const password = process.env.INIT_PASSWORD_HASH!

  const response = await Promise.all([
    prisma.user.upsert({
      where: { email: 'rauchg@vercel.com' },
      update: {},
      create: {
        email: 'rauchg@vercel.com',
        password
      },
    }),
    prisma.user.upsert({
      where: { email: 'lee@vercel.com' },
      update: {},
      create: {
        email: 'lee@vercel.com',
        password
      },
    }),
    prisma.user.upsert({
      where: { email: 'stey@vercel.com' },
      update: {},
      create: {
        email: 'stey@vercel.com',
        password
      },
    }),
  ])
  await Promise.all([
    prisma.ghost.upsert({
      where: { userId: 1 },
      update: {},
      create: {
        userId: 1,
        name: 'Guillermo Rauch',
        credit: 100,
        tech: {},
        overview: {}
      }
    }),
    prisma.ghost.upsert({
      where: { userId: 2 },
      update: {},
      create: {
        userId: 2,
        name: 'Lee Robinson',
        credit: 100,
        tech: {},
        overview: {}
      }
    }),
    prisma.ghost.upsert({
      where: { userId: 3 },
      update: {},
      create: {
        userId: 3,
        name: 'Tim Neutkens',
        credit: 100,
        tech: {},
        overview: {}
      }
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
