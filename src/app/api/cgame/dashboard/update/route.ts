import prisma from '@/lib/prisma'
import { authGhost } from '@/lib/auth'
import { newPlayer } from '@/gameplay/generator'

export const dynamic = 'force-dynamic'

export async function POST() {
  const ghost = await authGhost()
  // ARK
  const arks = await prisma.ark.findMany({
    where: {
      ghostId: ghost.id,
    },
  })

  if (arks.length === 0) {
    let player = newPlayer()
    let isAvailable = false
    while (!isAvailable) {
      // Check if AP is available
      const ap = await prisma.accessPort.findUnique({
        where: {
          id: player.accessPort.id,
        },
      })
      if (!ap) {
        isAvailable = true
      }
      player = newPlayer()
    }
    await prisma.accessPort.create({
      data: {
        ...player.accessPort,
        facilities: player.accessPort.facilities as any,
      },
    })
    const ark = await prisma.ark.create({
      data: {
        ...player.ark,
        facilities: player.ark.facilities as any,
        ghostId: ghost.id,
      },
    })
    arks.push(ark)
  }

  const accessPorts = await Promise.all(
    arks.map(async (ark) => {
      return await prisma.accessPort.findFirst({
        where: {
          id: ark.position,
        },
      })
    })
  )

  // TODO: Fleets

  return Response.json({
    ghost,
    arks,
    accessPorts: accessPorts.filter((ap) => ap),
  })
}
