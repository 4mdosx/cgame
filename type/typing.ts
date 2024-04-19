import { Prisma } from "@prisma/client"

export interface Facility {
  type: string
  id: string
  level: number
}

export interface EntryHost {
  id: string // 00.256.256.256
  type: 'M' | 'K' | 'G' | 'F' | 'A' | 'B' | 'O'
  attributes: {
    [key: string]: any
  }
  view: {
    [key: string]: any
  }
}

export interface AccessPort {
  id: string // 00.256.256.256:1024
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
  view: {
    [key: string]: any
  }
}
