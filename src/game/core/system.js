export class SystemModule {
  name = 'system'
  constructor() {
    this.building_effect = {}
    this.tick_count = 0
    this.store = {
      territorial_radius: 0
    }
  }

  dispatch(action) {
    switch (action.type) {
      case 'tick':
        this.tick_count++
        if (this.tick_count % 10 === 0) this.context.dispatch({ type: 'work' })
        break
      case 'work':
        this.modules.home.buildings.forEach(building => building.run())
        break
      case 'system/sync':
        this.modules.home.buildings.forEach(building => {
          const effect = building.getEffect()
          if (!effect) return
          Object.entries(effect).forEach(([key, val]) => {
            if (this.building_effect[key]) {
              this.building_effect[key] += val
            } else {
              this.building_effect[key] = val
            }
          })
        })
        break
      default:
    }
  }

  valueOf() {
    return {
      store: this.store
    }
  }

  init({ system } = {}) {
    if (!system) return
    if (system.store) Object.assign(this.store, system.store)
  }
}
