import { Ark, AccessPort } from "../../type/typing"
import facility from "./mod/facilities"

export function buildPoint ({ accessPort }: { accessPort: AccessPort }) {
  let build = 0
  if (accessPort) {
    accessPort.facilities.forEach(fac => {
      const schema = facility.ap[fac.id]
      schema.effect.forEach(eff => {
        if (eff.type === 'build') {
          if (eff.resource) {
            build += eff.value * fac.level * accessPort.attributes[eff.resource]
          } else {
            build += eff.value * fac.level
          }
        }
      })
    })
  }

  return build
}

export function buildCost ({ accessPort, buildName }: { accessPort: AccessPort, buildName: string }) {
  const fac = accessPort.facilities.find(f => f.id === buildName) || { id: buildName, level: 0 }
  if (!facility.ap[buildName]) {
    throw new Error('facility not found')
  }

  const cost = (fac.level + 1) ** 1.5 * facility.ap[buildName].cost
  return Math.floor(cost)
}

export function buildFinishedAt ({ cost, buildPoint }: { cost: number, buildPoint: number }) {
  const time = cost / buildPoint * 3600
  return new Date(Date.now() + Math.max(time, 60) * 1000) // 60s is the minimum time
}

export function accessPortAttrs (accessPort: AccessPort) {
  const attrs = Object.assign({
    economy: 0,
    intelligence: 0,
    build: 0,
    industrial: 0,
    energy: 0,
    energy_used: 0,
    supply: 0,
    supply_used: 0,
    area: 0,
    area_used: 0
  }, accessPort.attributes)
  accessPort.facilities.forEach(fac => {
    const schema = facility.ap[fac.id]
    schema.effect.forEach(eff => {
      if (eff.resource) {
        attrs[eff.type] += eff.value * fac.level * accessPort.attributes[eff.resource]
      } else {
        attrs[eff.type] += eff.value * fac.level
      }
    })
  })
  return attrs
}
