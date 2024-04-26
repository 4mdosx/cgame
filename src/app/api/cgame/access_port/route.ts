import prisma from '@/lib/prisma'
import { authGhost } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export async function GET() {
  const ghost = await authGhost()
  const ap = await prisma.ark.findMany({
    where: {
      ghostId: ghost.id,
    },
    include: {
      accessPort: true,
    },
  })
  const accessPorts = ap.map((a) => a.accessPort).filter((a) => a !== null)
  return Response.json({ accessPorts })
}
