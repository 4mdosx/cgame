import { authGhost } from '@/lib/auth'
export const dynamic = 'force-dynamic'

export async function GET() {
  const ghost = await authGhost()

  return Response.json(ghost)
}
