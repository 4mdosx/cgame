// https://github.com/prisma/prisma
import prisma from '@/lib/prisma'

export async function getGhost(userId: number) {
  return await prisma.ghost.findFirst({
    where: {
      userId
    }
  })
}
