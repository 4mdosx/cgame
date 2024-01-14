import proposals from "../schema/proposal"
import { Log } from "../log"
import { getBuilding } from '../interface'
export class SystemModule {
  name = 'system'
  constructor() {
    this.building_effect = {}
    this.tick_count = 0
    this.store = {
      territorial_radius: 0
    }
    this.tech = {
      categories: ['common'],
    }
    this.cyborg = {
      mem: { val: 0, max: 64, unit: 'KB' },
      power: { val: 0, max: 1, recovery: true, unit: 'point' },
      performance: { val: 0, max: 1, recovery: true, unit: 'point' },
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
        this.update()
        break
      case 'system/research':
        this.research()
        break
      case 'building/completed':
        this.store['building/' + action.building.data.name] = true
        break
      case 'system/sync':
        this.building_effect = {}
        this.modules.home.buildings.forEach(building => {
          const effect = building.effect
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

  update () {
    // 更新库存
    Object.entries(this.cyborg).forEach(([key, val]) => {
      if (val.val >= val.max) return
      if (val.recovery) {
        this.cyborg[key].val += this.get('recovery_rate/' + key)
      }
      if (val.val > val.max) {
        this.cyborg[key].val = val.max
      }
    })
  }

  research () {
    if (this.cyborg.power.val < 1) return
    this.cyborg.power.val -= 1
    // 初始化卡池
    const proposal = []
    Object.entries(proposals).forEach(([key, val]) => {
      if (this.tech.categories.includes(key)) {
        val.forEach(item => {
          proposal.push({
            category: key,
            id: item.id,
          })
        })
      }
    })

    // 随机抽取
    const index = Math.floor(Math.random() * proposal.length)
    const item = proposal[index]
    const proposal_schema = proposals[item.category].find(proposal => proposal.id === item.id)

    this.modules.inventory.addProposal(proposal_schema)
  }

  get(key) {
    const val_s = this.store[key] || 0
    if (typeof val_s !== 'number') return val_s
    const val_b = this.building_effect[key] || 0
    return val_b + val_s
  }

  valueOf() {
    return {
      store: this.store,
      tech: this.tech,
      cyborg: { ...this.cyborg },
    }
  }

  init({ system } = {}) {
    if (!system) return
    if (system.store) Object.assign(this.store, system.store)
    if (system.tech) Object.assign(this.tech, system.tech)
    if (system.cyborg) Object.assign(this.cyborg, system.cyborg)
  }
}
