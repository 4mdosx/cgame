import { Heading, Box, Badge, Flex, Separator, Button } from '@radix-ui/themes'
import DroneIcon from '@/components/icons/drone'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { AccessPortWithComputedAttrs, Ark } from '../../type/typing'
import BuildingList from './building_list'
import { createContext, useContext } from 'react'
import facilityMod from '@/gameplay/mod/facilities'
import { intervalToDuration } from 'date-fns'
import { useEffect, useState } from 'react'
import './ap_panel.css'

function pad(num: number = 0) {
  return num.toString().padStart(2, '0')
}

function QueueItem(props: any) {
  const { buildName, status, finishedAt, createdAt, id } = props
  const facility = facilityMod.ap[buildName]
  const duration =
    status === 'processing'
      ? intervalToDuration({ start: Date.now(), end: +new Date(finishedAt) })
      : intervalToDuration({
          start: +new Date(createdAt),
          end: +new Date(finishedAt),
        })
  const formatted = `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(
    duration.seconds
  )}`
  // 每秒更新一次
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (status === 'pending') return
    const timer = setInterval(() => {
      setStep((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [status])
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => {
      return fetch('/api/cgame/access_port/facility/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: id }),
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['work_queue'] })
    },
  })

  return (
    <Box>
      <Heading size="4" mb="1" weight="medium">
        {facility.name}
      </Heading>
      {
        {
          processing: (
            <Flex justify="start">
              <div>
                <i className="bi-alarm mr-1 text-orange-700"></i>
                <span className="text-orange-700">{formatted}</span>
              </div>
            </Flex>
          ),
          pending: (
            <Flex justify="between">
              <div>
                <i className="bi-alarm mr-1 text-orange-700"></i>
                <span className="text-orange-700">{formatted}</span>
              </div>
              <Button color="crimson" variant="soft" size="1" onClick={() => mutation.mutate()}>
                <i className="bi-x-lg"></i>
              </Button>
            </Flex>
          ),
        }[status]
      }
    </Box>
  )
}

function Queue() {
  const { ap } = useContext(AccessPortContext)
  const ark = ap?.ark || ({ attributes: {} } as Ark)
  const { isPending, error, data } = useQuery({
    queryKey: ['work_queue'],
    queryFn: () =>
      fetch(`/api/cgame/ark/${ark.id}/queue`).then((res) => res.json()),
    refetchInterval: 5 * 60 * 1000,
  })
  if (isPending) return '...'

  return (
    <div>
      <Heading size="5" mb="1" mt="1">
        Construction Queue
      </Heading>
      <Flex gap="1" wrap="wrap">
        <Badge color="blue">
          <i className="bi-hammer"></i>
          {ap?.computedAttrs.build + ark.attributes.build}
        </Badge>
        <Badge color="blue">
          <i className="bi-gear-wide-connected"></i>
          {ap?.computedAttrs.industrial + ark.attributes.industrial}
        </Badge>
        <Badge color="blue">
          <i className="bi-postage-fill"></i>
          {ap?.computedAttrs.intelligence + ark.attributes.intelligence}
        </Badge>
      </Flex>
      <Separator my="4" size="4" color="cyan" />
      {data.building.map((item: any) => (
        <QueueItem key={item.id} {...item}></QueueItem>
      ))}
    </div>
  )
}

function Camp() {
  const { ap } = useContext(AccessPortContext)
  return (
    <Flex align="start" gap="2" className="w-full">
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
      <Box className="w-1/3">
        <Queue></Queue>
      </Box>
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
        className="bg-white rounded-2xl p-2 flex relative overflow-hidden pl-14"
      >
        <div className="ap-panel_mark">
          <div className="outside-circle active">
            <div className="text">
              <i className="bi-buildings-fill text-xl"></i>
              <span className="ml-3">Camp</span>
            </div>
          </div>
          <div className="outside-circle">
            <div className="text">
              <i className="bi-eraser-fill text-xl"></i>
              <span className="ml-3">Shipyard</span>
            </div>
          </div>
        </div>
        <Camp></Camp>
      </Box>
    </AccessPortContext.Provider>
  )
}
