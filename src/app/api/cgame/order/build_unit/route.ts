import { authGhost } from '@/lib/auth'
import initArk from '@/gameplay/class/ark'

interface BuildUnitRequestBody {
  arkId: number
  unitId: string
  unitCount: number
}
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  const { arkId, unitId, unitCount }: BuildUnitRequestBody = await request.json()
  const ghost = await authGhost()

  const ark = await initArk(arkId, {
    ghostId: ghost.id,
  })
  await ark.buildUnit({
    unitId,
    unitCount,
  })

  return Response.json({ ok: true })
}
