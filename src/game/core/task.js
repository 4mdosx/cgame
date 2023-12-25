import { buildings } from '../schema/building'
import _ from 'lodash'

class Task {
  constructor (params) {
    this.id = params.id
    this.data = {
      type: params.type,
      schema: params.schema,
      stock: params.stock,
      cost: params.cost,
    }
    if (params.type === 'building') {
      this.schema = buildings[params.schema]
    } else {
      this.schema = {}
    }

    this.status = 'pending' // pending, doing, done
    this.update()
  }

  toJSON () {
    return this.data
  }

  update () {
    this.cost = _.cloneDeep(this.schema.cost) || {}
    if (this.data.cost) {
      Object.keys(this.data.cost).forEach(key => {
        this.cost[key] = this.data.cost[key]
      })
    }

    this.progress = 0
    this.total = this.schema.time || 1
  }
}

export class TaskModule  {
  name = 'task'
  constructor () {
    this.queue = []
  }

  dispatch (modules, action) {
    switch (action.type) {
      case 'tick':
        break
      default:
        break
    }
  }

  doProposal (proposalId) {
    const proposal = this.modules.inventory.proposals.find(proposal => proposal.id === proposalId)
    console.log(proposal, proposalId)
    if (this.queue.find(task => task.id === proposal.id)) return
    this.queue.push(new Task({
      id: proposalId,
      type: proposal.type,
      schema: proposal.schema,
      cost: {
        proposal: proposalId
      }
    }))
  }

  get () {
    return this.status
  }

  init ({ task } = {}) {
    if (task && task.queue) this.queue = task.queue.map(t => new Task(t))
  }

  save () {
    return {
      queue: this.queue.map(task => task.toJSON()),
    }
  }
}
