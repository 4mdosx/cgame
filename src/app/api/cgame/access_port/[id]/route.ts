import { getAccessPort } from '@/lib/model'
import * as calculator from '@/gameplay/calculator'
export const dynamic = 'force-dynamic'
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const ap = await getAccessPort(id)

  return Response.json({ ...ap, computedAttrs: calculator.accessPortAttrs(ap) })
}
