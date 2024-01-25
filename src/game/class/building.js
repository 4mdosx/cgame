import { buildings } from '../schema/building'
import { decorators } from '../script/decorators'

export class Building {
  constructor (data) {
    this.data = data
    this.schema = buildings[data.name]
    this.create()
  }

  upgrade () {
    this.data.level++
  }

  run () {
    for (const runner of this.runners) {
      runner()
    }
  }

  create () {
    this.runners = []
    this.schema.keywords.forEach(keyword => {
      const decorator = decorators[keyword]
      if (decorator) decorator(this)
    })
    if (this.data.level === undefined) this.data.level = 1
  }

  get time () {
    return (this.schema.time || 1) * this.data.level
  }

  get effect () {
    if(!this.schema.effect) return null
    const effect = {}
    Object.entries(this.schema.effect).forEach(([key, val]) => {
      if (typeof val === 'function') effect[key] = val(this.data)
      else effect[key] = val
    })
    return effect
  }

  get cost () {
    if(!this.schema.cost) return null
    const cost = {}
    Object.entries(this.schema.cost).forEach(([key, val]) => {
      if (typeof val === 'function') cost[key] = val(this.data)
      else cost[key] = val
    })
    return cost
  }

  valueOf () {
    return this.data
  }
}
