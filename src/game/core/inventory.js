// 所有模块产生的物品记录

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
        if (this.items[action.itemName]) {
          this.items[action.itemName] += action.quantity
        } else {
          this.items[action.itemName] = action.quantity
        }
        break
      case 'task/finish':
        const task = action.task
        if (task.data.proposal) {
          this.proposals = this.proposals.filter(proposal => proposal.id !== task.data.proposal)
        }
        break
      case 'discovery':
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
