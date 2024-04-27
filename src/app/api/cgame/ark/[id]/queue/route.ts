import prisma from '@/lib/prisma'
import { authGhost } from '@/lib/auth'
import { Ark } from '../../../../../../../type/typing'

export const dynamic = 'force-dynamic'
export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params
  const ghost = await authGhost()
  const { buildOrders } = (await prisma.ark.findFirst({
    where: {
      ghostId: ghost.id,
      id: Number(id),
    },
    include: {
      buildOrders: {
        where: {
          status: {
            in: ['processing', 'pending'],
          },
        }
      },
    },
  })) as unknown as Ark

  return Response.json({ building: buildOrders })
}
