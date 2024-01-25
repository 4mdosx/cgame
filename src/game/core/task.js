import _ from 'lodash'
import { Task } from '../class/task'

export class TaskModule  {
  name = 'task'
  constructor () {
    this.queue = []
  }

  dispatch (action) {
    switch (action.type) {
      case 'tick':
        if (this.queue[0]) {
          const task = this.queue[0]
          if (task.status === 'done') {
            this.queue.shift()
            this.context.dispatch({
              type: `${task.data.type}/completed`,
              name: task.data.schema
            })
            this.context.dispatch({ type: 'system/sync' })
          }
        }
        break
      case 'task/create': {
        const { proposal } = action
        if (proposal) {
          const task = new Task({
            id: crypto.randomUUID(),
            type: proposal.type,
            schema: proposal.schema,
          }, proposal.extra)
          this.queue.push(task)
        }
        break
      }
      default:
        break
    }
  }

  valueOf () {
    return {
      queue: this.queue.map(task => task.toJSON()),
    }
  }

  init ({ task } = {}) {
    if (!task) return
    if (task.queue) this.queue = task.queue.map(t => new Task(t))
  }
}
