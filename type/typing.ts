import { Prisma } from "@prisma/client"

export type Position = string // ex. 00.256.256.256:1024
export interface Facility {
  type: string
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
  }
}


export interface AccessPort {
  id: Position
  environment: string
  facilities: Facility[]
  attributes: {
    [key: string]: any
    space: number
    solar: number
    fertility: number
    mineral: number
    ether: number
  }
}
