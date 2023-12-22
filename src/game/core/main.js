import { WorldModule } from './world'
import { HomeModule } from './home'
import { CharacterModule } from './character'
import { TaskModule } from './task'
import { InventoryModule } from './inventory'


export default class Game {
  constructor() {
    this.modules = {}
    this.stopMain = null
    this.lastTick = null
    this.tickLength = 1000
    this.register(WorldModule.name, new WorldModule())
    this.register(HomeModule.name, new HomeModule())
    this.register(CharacterModule.name, new CharacterModule())
    this.register(TaskModule.name, new TaskModule())
    this.register(InventoryModule.name, new InventoryModule())
  }

  register(name, module) {
    this.modules[name] = module
  }

  init(payload) {
    // 模块从存档恢复状态
    Object.values(this.modules).forEach((module) => {
      module.load && module.init(payload)
    })

    this.lastTick = payload && payload.lastTick || performance.now()

    // 开始主循环
    this.main(this.lastTick)
  }

  main (tFrame) {
    this.stopMain = setTimeout(() => this.main(performance.now()), 100)
    const nextTick = this.lastTick + this.tickLength
    let numTicks = 0

    if (tFrame > nextTick) {
      const timeSinceTick = tFrame - this.lastTick
      numTicks = Math.floor(timeSinceTick / this.tickLength)
    }

    for (let i = 0; i < numTicks; i++) {
      this.lastTick += this.tickLength
      this.dispatch({ type: 'tick' })
    }
    this.lastTick = performance.now()
  }

  dispatch(action) {
    Object.values(this.modules).forEach((module) => {
      module.dispatch && module.dispatch(this.modules, action)
    })
  }

  snapShot () {
    const payload = {
      lastTick: this.lastTick,
    }
    Object.values(this.modules).forEach((module) => {
      if (module.snapShot) {
        const moduleSnapshot = module.save()
        payload[module.name] = moduleSnapshot
      }
    })
    return JSON.stringify(payload)
  }
}
