import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcrypt-ts'
import { getUser } from '@/model/user'
import { getGhost } from '@/model/ghost'
import { authConfig } from './auth.config'
import { Ghost } from '@prisma/client'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        let user = await getUser(email)
        if (user.length === 0) return null
        let passwordsMatch = await compare(password, user[0].password!)
        if (passwordsMatch) return user[0] as any
      },
    }),
  ],
})

export async function authGhost (){
  const session = await auth()
  if (!session) throw new Error('No session found')

  const user = await getUser(session.user!.email!)
  const ghost = await getGhost(user[0].id)

  return ghost as Ghost
}
