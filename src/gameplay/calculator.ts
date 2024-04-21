import { Ark, AccessPort } from "../../type/typing"
import facility from "./mod/facilities"

export function buildPoint ({ ark, accessPort }: { ark: Ark, accessPort: AccessPort }) {
  let build = ark.attributes.build
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

export function buildFinishedAt ({ cost, buildPoint }: { cost: number, buildPoint: number }) {
  const time = cost / buildPoint * 3600
  return new Date(Date.now() + Math.min(time, 60) * 1000) // 60s is the minimum time
}