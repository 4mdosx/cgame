import { proposals } from "../schema/proposal"
import { research } from "../schema/research"
import { Log } from "../log"
import { dispatch } from '../interface'

export class SystemModule {
  name = 'system'
  constructor() {
    this.building_effect = {}
    this.tick_count = 0
    this.store = {
      categories: ['common'],
      territorial_radius: 0
    }
    this.cyborg = {
      apps: [],
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
        this.store['building/' + action.name] = true
        break
      case 'research/completed': {
        const r = research[action.name]
        if (!r) return
        r.finish && r.finish(this.context)
        dispatch({ type: 'store/update', name: 'RESEARCH/' + action.name, val: 1 })
        if (!this.get(['MAX_STORAGE/' + action.name])) break
        dispatch({ type: 'store/update', name: 'MAX_STORAGE/' + action.name, val: r.max || 1 })
        break
      }
      case 'discovery':
        if (!this.get(['MAX_STORAGE/' + action.name])) {
          dispatch({ type: 'store/update', name: 'MAX_STORAGE/' + action.name, val: 100 })
        }
        break
      case 'store/update': {
        const { name, val } = action
        if (!this.store[name]) this.store[name] = 0
        this.store[name] += val
        break
      }
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
    // 更新虚拟性能
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
    // if (this.cyborg.power.val < 1) return
    // this.cyborg.power.val -= 1
    // 初始化卡池
    const pools = []
    Object.entries(proposals).forEach(([key, val]) => {
      if (this.store.categories.includes(key)) {
        val.forEach(item => {
          pools.push({
            category: key,
            id: item.id,
          })
        })
      }
    })

    // 随机抽取
    const index = Math.floor(Math.random() * pools.length)
    const item = pools[index]
    const proposal_schema = proposals[item.category].find(proposal => proposal.id === item.id)

    // 检查是否达到最大等级
    if (proposal_schema.type === 'research') {
      if (this.get(['RESEARCH/' + proposal_schema.schema]) && this.get(['RESEARCH/' + proposal_schema.schema]) >= this.get('MAX_STORAGE/' + proposal_schema.schema)) {
        Log.info('研究到了新的技术：' + proposal_schema.schema + '，但是已经达到了最大等级')
        return
      }
    }

    Log.info('研究到了新的技术：' + proposal_schema.schema)
    dispatch({ type: 'inventory/proposal/add', proposal: proposal_schema })
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
      cyborg: this.cyborg,
    }
  }

  init({ system } = {}) {
    if (!system) return
    if (system.store) Object.assign(this.store, system.store)
    if (system.cyborg) Object.assign(this.cyborg, system.cyborg)
  }
}
