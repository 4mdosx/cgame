import { getUser } from '@/model/user'
import { getGhost } from '@/model/ghost'
import { auth } from '@/lib/auth'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) return null

  const user = await getUser(session.user!.email!)
  const ghost = await getGhost(user[0].id)

  return Response.json({ session, ghost })
}
