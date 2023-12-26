import { getGameStore } from '../utils'

export const buildings = {
  bonfire: {
    name: '篝火',
    size: 'standard',
    keywords: ['consume_fuel'],
    time: 1,
    effect: {}
  }
}

export class Building {
  constructor (data) {
    this.data = data
    this.schema = buildings[data.name]
    this.create()
  }

  run () {
    for (const runner of this.runners) {
      runner()
    }
  }

  create () {
    console.log('create')
    this.runners = []
    this.schema.keywords.forEach(keyword => {
      const decorator = decorators[keyword]
      if (decorator) decorator(this)
    })
  }

  getEffect () {
    return this.schema.effect
  }

  toJSON () {
    return this.data
  }

  get () {
    return this.data
  }
}

function consume_fuel (building) {
  console.log('consume_fuel init')
  if (!building.data.fuel) {
    building.data.fuel = {
      count: 50,
      max: 50,
    }
  }

  building.runners.push(() => {
    if (building.data.fuel.count > 0) {
      building.data.fuel.count--
      getGameStore().territorial_radius++
      console.log(getGameStore())
    }
  })
}

const decorators = {
  consume_fuel
}
