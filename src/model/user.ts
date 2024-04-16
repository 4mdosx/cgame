// https://github.com/prisma/prisma
import prisma from '@/lib/prisma'
import { genSaltSync, hashSync } from 'bcrypt-ts'

export async function getUser(email: string) {
  let salt = genSaltSync(10)
  let hash = hashSync('password', salt)
  return await prisma.users.findMany({
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