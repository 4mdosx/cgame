import { buildings } from '../schema/building'
import { research } from '../schema/research'
import { Building } from './building'
import { getBuilding } from '../interface'

export class Task {
  constructor (params, extra) {
    this.data = {
      type: params.type,
      schema: params.schema,
      stock: params.stock,
    }
    if (params.type === 'building') {
      this.schema = buildings[params.schema]
    } else if (params.type === 'research') {
      this.schema = research[params.schema]
    } else {
      this.schema = {}
    }

    this.id = params.id
    this.progress = params.progress || 0
    this.total = this.schema.time || 1
    this.status = params.status || 'pending' // pending, doing, done

    if (this.data.stock) return // 如果有库存，说明是从存档中读取的

    // 处理库存
    if (this.data.type === 'building') {
      let building = getBuilding(this.data.schema)
      if (!building) building = new Building({ name: this.data.schema })
      this.initStock(building.cost)
      this.total = building.time
    } else if (this.data.type === 'research') {
      this.initStock(this.schema.cost)
    } else {
      this.initStock({})
    }
    if (extra) {
      if (extra.free) {
        this.data.stock = []
      }
    }
  }

  toJSON () {
    return {
      ...this.data,
      status: this.status,
      progress: this.progress,
      total: this.total,
      id: this.id,
    }
  }

  initStock (cost) {
    this.data.stock = []
    Object.entries(cost).forEach((key, val) => {
      this.data.stock.push({
        name: key,
        count: 0,
        max: val
      })
    })
  }
}