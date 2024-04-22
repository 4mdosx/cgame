import * as ark from '@/gameplay/ark'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  const res = await request.json()

  await ark.build(res.arkId, res.buildName)

  return Response.json({ ok: true })
}
