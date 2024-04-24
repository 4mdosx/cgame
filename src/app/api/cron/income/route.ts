import * as serverTick from '@/gameplay/server_tick'

export const dynamic = 'force-dynamic'
export async function GET() {

  await serverTick.incomeUpdate()
  return Response.json({ success: true })
}
