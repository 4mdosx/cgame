import prisma from '@/lib/prisma'
import { authGhost } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export async function POST(
  request: Request,
) {
  const ghost = await authGhost()
  const { orderId } = await request.json()
  const { buildOrders } = (await prisma.ark.findFirst({
    where: {
      ghostId: ghost.id,
    },
    include: {
      buildOrders: {
        where: {
          status: 'pending',
          id: orderId
        }
      },
    },
  })) as any

  if (!buildOrders || !buildOrders.length) {
    return Response.json({ error: 'Order not found' }, { status: 404 })
  }
  await prisma.buildOrder.delete({
    where: {
      id: orderId
    }
  })

  return Response.json({ ok: true })
}
