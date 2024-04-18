'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box } from '@radix-ui/themes'
import Nav from './components/nav'
import { Theme } from '@radix-ui/themes'
import '../globals.sass'

const queryClient = new QueryClient()

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Theme>
          <QueryClientProvider client={queryClient}>
            <Nav></Nav>
            <Box ml="3rem" pl="2rem" p="1rem" height="100vh" style={{
              backgroundColor: 'var(--nav-bg-color)',
              backgroundImage: 'url(/bg1.png)',
              backgroundSize: 'cover',
            }}>{children}</Box>
          </QueryClientProvider>
        </Theme>
      </body>
    </html>
  )
}
