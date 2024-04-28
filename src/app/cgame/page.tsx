'use client'
import {
  Heading,
  Grid,
  Box,
  Badge,
  Flex,
  Separator,
  Button,
} from '@radix-ui/themes'
import APlist from '@/components/ap_list'
import APPanel from '@/components/ap_panel'
import Credit from '@/components/credit'
import {
  useQuery,
} from '@tanstack/react-query'
export default function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('/api/cgame/dashboard/update', {
        method: 'POST',
      }).then((res) =>
        res.json()
      ),
  })

  if (isPending) return 'Loading...'

  return (
    <div>
      <Grid columns="4" gap="4" width="auto">
        <APlist></APlist>
        <Box>
          <div className="bg-white rounded-lg p-2 text-right">
            <div
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.6' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '6px',
                height: '68px',
                width: '100%',
              }}
            ></div>
          </div>
        </Box>
        <Box>
          <Credit></Credit>
        </Box>
        <APPanel></APPanel>
      </Grid>
    </div>
  )
}
