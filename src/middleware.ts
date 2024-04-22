import { auth } from './lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/api/cron')) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false },
        {
          status: 401,
        },
      );
    }
    return // allow cron job
  }

  if (!req.auth) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }
})

export const config = {
  matcher: ['/cgame/:path*', '/api/cgame/:path*', '/session/:path*', '/api/cron/:path*'],
}
