import { Ghost, Prisma } from '@prisma/client'

export type Position = string // ex. 00.256.256.256:1024
export interface Facility {
  id: string
  level: number
}

export interface EntryHost {
  id: Position
  type: 'M' | 'K' | 'G' | 'F' | 'A' | 'B' | 'O'
  attributes: {
    [key: string]: any
  }
}

export interface Ark {
  id: number
  ghostId: number
  position: Position
  facilities: Facility[]
  apron: {
    [key: string]: number
  }
  attributes: {
    [key: string]: any
    power: number
    power_max: number
    build: number
    industrial: number
    intelligence: number
    facility_queue: number
    build_queue: number
  }
  ghost: Ghost
  buildOrders: any[]
  accessPort: AccessPort
}

export interface ArkAttrs {
  [key: string]: any
}
export interface ArkWithComputedAttrs extends Ark {
  computedAttrs: {
    [key: string]: any
  }
}

export interface AccessPort {
  id: Position
  name: string
  environment: string
  facilities: Facility[]
  attributes: {
    [key: string]: any
    area: number
    solar: number
    fertility: number
    mineral: number
    ether: number
  }
}

export interface AccessPortWithComputedAttrs extends AccessPort {
  ark: Ark
  computedAttrs: {
    [key: string]: any
  }
}

export interface Order {
  id: string
  ghostId: number
  status: 'pending' | 'processing' | 'finished'
  type: 'build_unit' | 'build_facility'
  progress: number
  progressMax: number
  payload: {
    [key: string]: any
  }
  createdAt: Date
}

export interface BuildUnitOrder extends Order {
  type: 'build_unit'
  payload: {
    [key: string]: any
    unitId: number
    unitCount: number
    arkId: number
  }
}

export interface BuildOrder {
  id: string
  arkId: number
  buildName: string
  status: 'pending' | 'processing' | 'finished'
  payload: {
    position: Position
  }
  createdAt: Date
  finishedAt: Date
}
