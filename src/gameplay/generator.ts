import { randomPort, randomNormalDistribution } from '../lib/random'
import map from './mod/map'
import { EntryHost, AccessPort, Facility, Ark } from '../../type/typing'

function getNormalPosition () {
  let mean = 1 // 均值
  let stdDev = 2000 // 标准差
  const gridSize = 4096
  let x = 0, y = 0
  while (x === 0 || y === 0) {
    let tx = randomNormalDistribution(mean, stdDev)
    let ty = randomNormalDistribution(mean, stdDev)
    tx = Math.round(tx + gridSize / 2)
    ty = Math.round(ty + gridSize / 2)
    if (tx > 0 && tx < gridSize && ty > 0 && ty < gridSize) {
      x = tx
      y = ty
    }
  }

  const BlockX = Math.ceil( x / 256 )
  const BlockY = Math.ceil( y / 256 )
  const BlockId = (BlockY - 1) * 16 + BlockX

  return {
    BlockId,
    offsetX: x - (BlockX - 1) * 256,
    offsetY: y - (BlockY - 1) * 256
  }
}

export function generatorEntry(
  LANId: string,
  params: any = {}
): EntryHost {
  const { BlockId, offsetX, offsetY } = getNormalPosition()
  const id = `${LANId}.${BlockId}.${offsetX}.${offsetY}`

  return {
    id,
    type: params.type || 'G',
    attributes: {
      ...params.attributes,
    }
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

  return ap
}

export function generatorAccessPort(entry: EntryHost, params: any): AccessPort {
  const port = randomPort()
  const id = `${entry.id}:${port}`

  const environment = params.environment || 'earthly'
  const baseParams = {
    id,
    name: params.name || 'Vacant World',
    environment,
    facilities: [] as Facility[],
    attributes: { ...map.environment[environment], ...params.attributes }
  }

  return createAccessPoint(baseParams)
}

export function generatorArk(): Partial<Ark> {
  const ark = {
    position: '',
    facilities: [] as Facility[],
    apron: {},
    attributes: {
      power_max: 10,
      power: 10,
      build: 20,
      industrial: 20,
      intelligence: 0,
      facility_queue: 3,
      build_queue: 3
    }
  }

  return ark
}

export function newPlayer () {
  const entry = generatorEntry('00')
  const accessPort = generatorAccessPort(entry, {})
  const ark = generatorArk()
  ark.position = accessPort.id

  return {
    accessPort,
    ark
  }
}
