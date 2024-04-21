import { getAccessPort } from '@/lib/model'

export const dynamic = 'force-dynamic'
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  return Response.json({ ap: await getAccessPort(id) })
}
