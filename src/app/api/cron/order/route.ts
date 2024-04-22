import * as serverTick from '@/gameplay/server_tick'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export async function GET() {

  await serverTick.orderUpdate()
  return Response.json({ success: true })
}
