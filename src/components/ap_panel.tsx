import { Heading, Box, Badge, Flex, Separator } from '@radix-ui/themes'
import DroneIcon from '@/components/icons/drone'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { AccessPortWithComputedAttrs } from '../../type/typing'
import BuildingList from './building_list'
import { createContext, useContext } from 'react'
import './ap_panel.css'

function Camp() {
  const { ap } = useContext(AccessPortContext)
  return (
    <Flex align="center" gap="2" className="w-full">
      <Box className="w-2/3">
        <div>
          <Heading size="5" mb="1" mt="1">
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
          <Separator my="4" size="4" color="cyan" />
          <BuildingList></BuildingList>
        </div>
      </Box>
      <Separator orientation="vertical" color="indigo"></Separator>
      <Box className="1/3">Queue</Box>
    </Flex>
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
      <Box
        gridColumnStart="1"
        gridColumnEnd="4"
        className="bg-white rounded-2xl p-2 flex relative overflow-hidden pl-10"
      >
        <div className="ap-panel_mark">
          <div className="outside-circle active">
            <div className='text'>
              <i className="bi-buildings-fill text-xl"></i>
              <span className='ml-3'>Camp</span>
            </div>
          </div>
          <div className="outside-circle">
          <div className='text'>
              <i className="bi-eraser-fill text-xl"></i>
              <span className='ml-3'>Shipyard</span>
            </div>
          </div>
        </div>
        <Camp></Camp>
      </Box>
      <p>{JSON.stringify(access_port)}</p>
    </AccessPortContext.Provider>
  )
}
