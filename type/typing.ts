import { Ghost, Prisma } from "@prisma/client"

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
  id : number
  ghostId: number
  position: Position
  facilities: Facility[]
  attributes: {
    [key: string]: any
    power: number
    power_max: number
    build: number
    industrial: number
    intelligence: number
    build_queue: number
  }
  ghost: Ghost
  buildOrders: any[]
  accessPort: AccessPort
}


export interface AccessPort {
  id: Position
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
