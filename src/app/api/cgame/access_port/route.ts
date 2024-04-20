
export const dynamic = 'force-dynamic'
export async function GET() {
  const AccessPort: Person = { name: '1', age: 2 }

  return Response.json(AccessPort)
}
