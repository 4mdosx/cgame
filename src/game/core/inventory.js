import { getGameStatus, getGameStore } from '@/game/utils/index.js'

export class InventoryModule  {
  name = 'inventory'
  constructor () {
    this.items = {}
    this.proposals = []
    this.blueprints = []
    this.artifacts = []
  }

  dispatch (action) {
    switch (action.type) {
      case 'character/gathering':
        const { itemName, quantity } = action
        if (!this.items[itemName]) this.items[itemName] = 0
        if (this.items[itemName] > getGameStatus('MAX_STORAGE/' + itemName)) return
        this.items[action.itemName] += action.quantity
        break
      case 'task/finish':
        const task = action.task
        if (task.data.proposal) {
          this.proposals = this.proposals.filter(proposal => proposal.id !== task.data.proposal)
        }
        break
      case 'discovery':
        const store = getGameStore()
        if (!store['MAX_STORAGE/' + action.name]) store['MAX_STORAGE/' + action.name] = 100
        break
      case 'tick':
        break
      default:
    }
  }

  valueOf () {
    return {
      items: this.items,
      proposals: this.proposals,
      blueprints: this.blueprints,
    }
  }

  init ({ inventory = {}, home}) {
    Object.assign(this, inventory)
    if (!home) {
      this.proposals.push({
        id: 'bonfire',
        type: 'building',
        schema: 'bonfire',
      })
    }
  }
}
