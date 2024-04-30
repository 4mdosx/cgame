import { authGhost } from '@/lib/auth'
import initArk from '@/gameplay/class/ark'
import prisma from '@/lib/prisma'

interface BuildUnitRequestBody {
  arkId: number
  unitId: string
  unitCount: number
  type: 'build_unit'
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { type }: { type?: string }) {
  const ghost = await authGhost()
  const orders = await prisma.order.findMany({
    where: {
      ghostId: ghost.id,
      type: type ? { equals: type } : undefined,
      status: {
        in: ['pending', 'processing']
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return Response.json({
    orders
  })
}

export async function POST(request: Request) {
  const { arkId, unitId, unitCount, type }: BuildUnitRequestBody = await request.json()
  const ghost = await authGhost()

  const ark = await initArk(arkId, {
    ghostId: ghost.id,
  })
  switch (type) {
    case 'build_unit':
      await ark.buildUnit({
        unitId,
        unitCount,
      })
      return Response.json({ ok: true })
    default:
      return Response.json({ ok: false, message: 'Invalid type'})
  }
}
