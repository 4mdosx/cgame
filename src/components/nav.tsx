import { Box, Flex } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import cx from 'clsx'

function NavLink({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <span
        className={cx(
          'hover:text-emerald-500',
          isActive ? 'text-shadow-emerald-500' : ''
        )}
      >
        {children}
      </span>
    </Link>
  )
}

export default function Nav() {
  return (
    <nav className='h-full'>
      <Box className="fixed left-0 top-0 w-16 m-0 h-full shadow-lg bg-slate-100 rounded-lg">
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ height: '100%' }}
        >
          <NavLink href="/cgame">
            <i className="bi-globe-asia-australia text-2xl"></i>
          </NavLink>
          <Box py="1" />
          <NavLink href="/cgame/overview">
            <i className="bi-pie-chart-fill text-2xl"></i>
          </NavLink>
          <Box py="9" />
          <NavLink href="/cgame/settings">
            <i className="bi-gear-fill text-2xl"></i>
          </NavLink>
        </Flex>
      </Box>
    </nav>
  )
}
