import prisma from '@/lib/prisma'
import * as calculator from '@/gameplay/calculator'
import { authGhost } from '@/lib/auth'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const ghost = await authGhost()
  const ap = (await prisma.accessPort.findUnique({
    where: {
      id,
    },
    include: {
      ark: {
        where: {
          ghostId: ghost.id,
        },
      },
    },
  })) as any

  if (!ap) {
    return Response.json(
      { success: false },
      {
        status: 404,
      }
    )
  }

  return Response.json({
    access_port: { ...ap, computedAttrs: calculator.accessPortAttrs(ap) },
    control: ap.ark ? true : false,
  })
}
