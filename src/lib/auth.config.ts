import { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user
      let isProtected = nextUrl.pathname.startsWith('/cgame') || nextUrl.pathname.startsWith('/session')

      if (isProtected) {
        if (isLoggedIn) return true
        return false
      }

      return true
    },
  },
} satisfies NextAuthConfig
