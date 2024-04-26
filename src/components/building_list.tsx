import { AccessPort, Ark } from '../../type/typing'
import {
  Heading,
  Badge,
  Flex,
  Separator,
  Button,
  Card,
  Text,
} from '@radix-ui/themes'
import DroneIcon from '@/components/icons/drone'
import { useContext, useState } from 'react'
import { AccessPortContext } from './ap_panel'
import facility from '@/gameplay/mod/facilities'
import * as calculator from '@/gameplay/calculator'
import './building_list.css'
import { intervalToDuration } from 'date-fns'
import clsx from 'clsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
function pad(num: number = 0) {
  return num.toString().padStart(2, '0')
}

const IconMap = {
  supply: <DroneIcon></DroneIcon>,
  supply_used: <DroneIcon></DroneIcon>,
  economy: <i className="bi-hexagon-fill"></i>,
  energy_used: <i className="bi-lightning-charge-fill"></i>,
  energy: <i className="bi-lightning-charge-fill"></i>,
  intelligence: <i className="bi-postage-fill"></i>,
  build: <i className="bi-hammer"></i>,
  industrial: <i className="bi-gear-wide-connected"></i>,
  area: <i className="bi-columns-gap"></i>,
  area_used: <i className="bi-columns-gap"></i>,
}

function EffectIcon({
  name,
  value,
  color = 'green',
}: {
  name: string
  value?: number
  color?: 'green' | 'red'
}) {
  return (
    <Badge color={color}>
      {IconMap[name]}
      <span>{value}</span>
    </Badge>
  )
}

function Building({
  id,
  buildPoint,
  onSort,
}: {
  id: string
  buildPoint: number
  onSort?: (cat: string) => void
}) {
  const { ap } = useContext(AccessPortContext)
  const [open, setOpen] = useState(false)
  const ark = ap?.ark as Ark
  const fac = ap?.facilities.find((f) => f.id === id)
  const facSpec = facility.ap[id]
  const cost = calculator.buildCost({ accessPort: ap!, buildName: id })
  const seconds = (cost / buildPoint) * 3600
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 }) || {
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
  const formatted = `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(
    duration.seconds
  )}`
  const categoryIconName = {
    base: 'boxes',
    tech: 'cpu-fill',
    eco: 'currency-exchange',
    ship: 'eraser-fill',
  }
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => {
      return fetch('/api/cgame/access_port/facility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ arkId: ark.id, buildName: id }),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work_queue'] })
    },
  })
  const costs = facSpec.effect.filter((e) => e.type.includes('_used'))
  const notEnough = [] as any
  costs.filter((e) => {
    const key = e.type.split('_')[0]
    if (
      (ap?.computedAttrs[key] || 0) <
      e.value + (ap?.computedAttrs[key + '_used'] || 0)
    ) {
      notEnough.push(key)
    }
  })

  return (
    <div className="building">
      <Flex align="center" justify="between">
        <Flex>
          <div
            className="sort-icon ml-2 mr-4 mt-4 hover:text-emerald-500"
            onClick={() => onSort && onSort(facSpec.category)}
          >
            <i
              className={clsx([
                'icon-1',
                'bi-' + categoryIconName[facSpec.category],
              ])}
            ></i>
            <i className="bi-chevron-double-up icon-2"></i>
          </div>
          <div>
            <Heading
              size="4"
              mb="1"
              weight="medium"
              onClick={() => setOpen(!open)}
              className="hover:underline"
            >
              {facSpec.name}
            </Heading>
            <Flex gap="4">
              <div>
                <i className="bi-hexagon mr-1 text-orange-700"></i>
                <span className="text-orange-700">{cost}</span>
              </div>
              <div>
                <i className="bi-alarm mr-1 text-orange-700"></i>
                <span className="text-orange-700">{formatted}</span>
              </div>
            </Flex>
          </div>
        </Flex>
        <Flex align="center">
          <Flex gap="1">
            {facSpec.effect
              .filter((e) => !e.type.includes('_used'))
              .sort((a, b) => a.type.localeCompare(b.type))
              .map((e) => {
                let value = e.value
                if (e.resource) {
                  value = value * (ap?.computedAttrs[e.resource] || 0)
                }
                if (value === 0) return null
                return (
                  <EffectIcon
                    key={e.type}
                    name={e.type}
                    value={value}
                  ></EffectIcon>
                )
              })}
          </Flex>
          <Button
            size="2"
            className="ml-2"
            onClick={() => mutation.mutate()}
            disabled={notEnough.length}
          >
            {notEnough.length ? (
              <div>
                { IconMap[notEnough[0]] }
              </div>
            ) : (
              <i className="bi-hammer"></i>
            )}
          </Button>
        </Flex>
      </Flex>
      {open && (
        <Card variant="surface" className="mt-2">
          <Text as="div" size="2" weight="bold">
            Description
          </Text>
          <Text as="div" color="gray" size="2">
            {facSpec.description}
          </Text>
          <Flex gap="1" className="mt-2">
            {facSpec.effect
              .filter((e) => e.type.includes('_used'))
              .sort((a, b) => a.type.localeCompare(b.type))
              .map((e) => {
                let value = e.value
                if (e.resource) {
                  value = value * (ap?.computedAttrs[e.resource] || 0)
                }
                if (value === 0) return null
                return (
                  <EffectIcon
                    key={e.type}
                    name={e.type}
                    color="red"
                    value={value}
                  ></EffectIcon>
                )
              })}
          </Flex>
        </Card>
      )}
    </div>
  )
}
export default function BuildingList() {
  const { ap } = useContext(AccessPortContext)
  const [preferred, setPreferred] = useState<string | null>(null)
  if (!ap) return null

  const buildPoint =
    calculator.buildPoint({ accessPort: ap }) + ap.ark.attributes.build
  const preferredFacility = [] as any
  const facilities = [] as any
  Object.entries(facility.ap).map(([id, fac]) => {
    if (fac.category === preferred) {
      preferredFacility.push(id)
    } else {
      facilities.push(id)
    }
  })

  return (
    <div className="buildings-list">
      {preferredFacility.concat(facilities).map((id) => (
        <div key={id}>
          <Building
            id={id}
            buildPoint={buildPoint}
            onSort={(cat) => setPreferred(cat)}
          ></Building>
          <Separator my="3" size="4" />
        </div>
      ))}
    </div>
  )
}
