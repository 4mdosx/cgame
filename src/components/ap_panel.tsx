import { Heading, Box, Badge, Flex, Separator } from '@radix-ui/themes'
import DroneIcon from '@/components/icons/drone'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { AccessPortWithComputedAttrs } from '../../type/typing'
import BuildingList from './BuildingList'
import { createContext, useContext } from 'react'

function Camp() {
  const { ap } = useContext(AccessPortContext)
  return (
    <div>
      <Heading size="5" mb="1">
        <i className="bi-buildings-fill text-xl mr-2"></i>
        Camp
      </Heading>
      <Flex justify="between">
        <Flex gap="1" wrap="wrap">
          <Badge color="blue">
            <DroneIcon></DroneIcon>
            {ap?.computedAttrs.supply_used}/{ap?.computedAttrs.supply}
          </Badge>
          <Badge color="blue">
            <i className="bi-lightning-charge-fill"></i>
            {ap?.computedAttrs.energy_used}/{ap?.computedAttrs.energy}
          </Badge>
          <Badge color="blue">
            <i className="bi-columns-gap"></i>
            {ap?.computedAttrs.area_used}/{ap?.computedAttrs.area}
          </Badge>
        </Flex>
        <Badge color="blue">
          <i className="bi-hexagon-fill"></i>
          {ap?.computedAttrs.economy}
        </Badge>
      </Flex>
      <Box pb="4"></Box>
      <BuildingList></BuildingList>
    </div>
  )
}

export const AccessPortContext = createContext<{
  ap: AccessPortWithComputedAttrs | null
}>({ ap: null })
export default function APPanel() {
  const searchParams = useSearchParams()
  const apId = searchParams.get('ap')
  const { isPending, error, data } = useQuery({
    queryKey: ['access_ports', apId],
    queryFn: () =>
      fetch(`/api/cgame/access_port/${apId}`).then((res) => res.json()),
  })
  if (!apId) return null
  if (isPending) return '...'
  const { access_port } = data as { access_port: AccessPortWithComputedAttrs }

  return (
    <AccessPortContext.Provider value={{ ap: access_port }}>
      <Box gridColumnStart="1" gridColumnEnd="4">
        <Flex align="center" gap="2" className="bg-white rounded-2xl p-2 flex">
          <Box className="w-2/3">
            <Camp></Camp>
          </Box>
          <Separator orientation="vertical" color="indigo"></Separator>
          <Box className="1/3">Queue</Box>
        </Flex>
      </Box>
      <p>{JSON.stringify(access_port)}</p>
    </AccessPortContext.Provider>
  )
}
