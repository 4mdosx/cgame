import { Box, Flex, Card, Text, ScrollArea } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { AccessPort } from '../../type/typing'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

function AccessPortItem(ap: AccessPort) {
  const router = useRouter()

  return (
    <Card
      className="min-w-40 border-cyan-500 border-2"
      onClick={() => router.push(`/cgame?ap=${ap.id}`)}
    >
      <Flex gap="3" align="center">
        <Box>
          <i className="bi-globe-asia-australia text-xl"></i>
        </Box>
        <Box>
          <Box>
            <Text as="div" size="2" weight="bold">
              {ap.name}
            </Text>
            <Text
              as="div"
              size="2"
              color="gray"
              className="capitalize text-nowrap"
            >
              {ap.environment} {ap.id.slice(3)}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Card>
  )
}

export default function ApList() {
  const { isPending, error, data } = useQuery({
    queryKey: ['access_ports'],
    queryFn: () => fetch('/api/cgame/access_port').then((res) => res.json()),
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (!data) return
    const ap = searchParams.get('ap')
    if (!ap) {
      router.push(`/cgame?ap=${data.accessPorts[0].id}`)
    }
  }, [searchParams, router, data])

  return (
    <Box
      gridColumnStart="1"
      gridColumnEnd="3"
      className="bg-white rounded-lg"
    >
      <ScrollArea type="auto" scrollbars="horizontal" className='p-2'>
        <div className="flex gap-2">
          {isPending ? '...' : error ? 'An error has occurred: ' + error : ''}
          {data?.accessPorts.map((ap: AccessPort) => (
            <AccessPortItem key={ap.id} {...ap} />
          ))}
        </div>
      </ScrollArea>
    </Box>
  )
}
