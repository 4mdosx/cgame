// https://github.com/prisma/prisma
import prisma from '@/lib/prisma'

export async function getUser(email: string) {
  return await prisma.user.findMany({
    where: {
      email: email
    }
  })
}

// export async function createUser(email: string, password: string) {
//   let salt = genSaltSync(10)
//   let hash = hashSync(password, salt)

//   return await db.insert(users).values({ email, password: hash })
// }