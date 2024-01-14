import { getGameStore, getContext } from '../utils'
import { buildings } from '../schema/building'

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

function consume_fuel (building) {
  if (!building.data.fuel) {
    building.data.fuel = {
      count: 10,
      max: 50,
    }
    if (building.data.name === 'bonfire' && building.data.hope_count === undefined) {
      building.data.hope_count = 4
    }
  }

  building.add_fuel = () => {
    if (building.data.fuel.count < building.data.fuel.max) {
      const { modules: { inventory } } = getContext()
      const candidates = inventory.match('fuel')
      const item = candidates.sort((a, b) => a[1].fuel - b[1].fuel)[0]
      if (!item) return
      const result = inventory.consume(item[0], 1)
      if (result) {
        building.data.fuel.count += item[1].fuel
        if (building.data.fuel.count > building.data.fuel.max) building.data.fuel.count = building.data.fuel.max
        getContext().dispatch({ type: 'system/sync' })
      }
    }
  }

  building.runners.push(() => {
    if (building.data.fuel.count > 0) {
      building.data.fuel.count--
      const store = getGameStore()
      const territorial_radius = store.territorial_radius
      if (territorial_radius > 1000) return
      if (territorial_radius % 100 === 0 || territorial_radius === 30) {
        if (building.data.hope_count > 0) {
          let name = ''
          if (building.data.hope_count === 4) name = 'stick'
          if (building.data.hope_count === 3) name = 'stone'
          if (building.data.hope_count === 2) name = 'wood'
          if (building.data.hope_count === 1) name = 'ora'

          getContext().dispatch({ type: 'world/home_expend', name })
          building.data.hope_count--
        } else {
          getContext().dispatch({ type: 'world/survey', position: [0, 0] })
        }
      }
      store.territorial_radius++
    } else {
      getContext().dispatch({ type: 'system/sync' })
    }
  })
}

const decorators = {
  consume_fuel
}