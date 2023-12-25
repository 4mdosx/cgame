// 所有模块产生的物品记录

export class InventoryModule  {
  name = 'inventory'
  constructor () {
    this.items = {}
    this.proposals = []
    this.blueprints = []
    this.artifacts = []
  }

  dispatch (modules, action) {
  }

  get () {
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

  save() {
    return this.get()
  }
}
