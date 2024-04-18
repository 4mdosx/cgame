import { auth } from './lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.rewrite(url)
  }
})

export const config = {
  matcher: ['/cgame/:path*', '/api/cgame/:path*', '/session/:path*'],
}
