import { randomPick, randomPort } from '../lib/pick'
import map from './mod/map'
import { EntryHost, AccessPort, Facility } from '../../type/typing'

export function generatorEntry(
  LANId: string,
  BlockId: string,
  params: any = {}
): EntryHost {
  const row = randomPick(256)
  const col = randomPick(256)
  const id = `${LANId}.${BlockId}.${row}.${col}`

  return {
    id,
    type: params.type || 'G',
    attributes: {
      ...params.attributes,
    },
    view: {},
  }
}

export function createAccessPoint(ap: AccessPort) {
  const port = Number(ap.id.split(':')[1])
  if (port < 1024) {
    ap.attributes.solar += 1
    ap.attributes.ether += 1
  } else if (port > 49151) {
    ap.attributes.solar -= 1
    ap.attributes.fertility -= 1
    ap.attributes.ether += 1
  }
  ap.view.space = ap.attributes.space
  ap.view.solar = ap.attributes.solar
  ap.view.fertility = ap.attributes.fertility
  ap.view.mineral = ap.attributes.mineral
  ap.view.ether = ap.attributes.ether

  return ap
}

export function generatorAccessPort(entry: EntryHost, params: any): AccessPort {
  const port = randomPort()
  const id = `${entry.id}:${port}`

  const environment = params.environment || 'earthly'
  const baseParams = {
    id,
    environment,
    facilities: [] as Facility[],
    attributes: { ...map.environment[environment], ...params.attributes },
    view: {},
  }

  return createAccessPoint(baseParams)
}
