import { buildings } from '../schema/building'

class Building {
  constructor (data) {
    this.data = data
    this.schema = buildings[data.name]
    this.create()
  }

  create () {}

  toJSON () {
    return this.data
  }

  get () {
    return this.data
  }
}

export class HomeModule  {
  name = 'home'
  constructor () {
    this.blockStatus = {}
    this.buildings = []
    this.overview = {
      territorial_radius: 0
    }
  }

  dispatch (action) {
    switch (action.type) {
      case 'task/finish':
        const task = action.task
        if (task.data.type === 'building') {
          this.buildings.push(new Building({
            status: 'normal',
            name: task.data.schema,
          }))
        }
        break
      case 'tick':
        break
      default:
    }
  }

  get () {
    return {
      buildings: this.buildings.map(building => building.get()),
      overview: this.overview,
    }
  }

  init ({ home = {}}) {
    Object.assign(this.overview, home.overview)
    this.buildings = home.buildings.map(building => new Building(building))
  }

  save () {
    return this.get()
  }
}

// 大地图模式，设定一个地块面积为 2km * 2km，在营地视图下，地块最小单位为 4m * 4m
// 坐标始终以篝火为中心，x，y 正负250，x 轴向东，y 轴向北
// 以地块坐标'x,k'为key，存储地块信息
