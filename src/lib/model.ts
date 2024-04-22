// https://github.com/prisma/prisma
import prisma from '@/lib/prisma'
import { AccessPort, Ark, Position } from '../../type/typing'

export async function getUser(email: string) {
  return await prisma.user.findMany({
    where: {
      email: email,
    },
  })
}

export async function getGhost(userId: number) {
  return (await prisma.ghost.findFirst({
    where: {
      userId,
    },
  }))
}

export async function getArk(arkId: number) {
  const ark = await prisma.ark.findFirst({
    where: {
      id: arkId,
    }
  })

  return ark as unknown as Ark
}

export async function getAccessPort(id: Position) {
  const ap = await prisma.accessPort.findFirst({
    where: {
      id,
    },
  })

  return ap as unknown as AccessPort
}
