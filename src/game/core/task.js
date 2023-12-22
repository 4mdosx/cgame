import data from './data'

class BuildingTask {
  constructor (buildingName) {

  }
}

// 任务调度,工作流
export class TaskModule  {
  name = 'task'
  constructor () {
    this.status = {}
  }

  dispatch (modules, action) {
    switch (action.type) {
      case 'tick':
        break
      case 'task/building':
        const building = data.search('building', action.buildingName)
        break
      default:
        break
    }
  }

  get () {
    return this.status
  }

  init (payload) {
    this.status = payload.task
  }

  save () {
    return this.status
  }
}
