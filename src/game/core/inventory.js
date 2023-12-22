// 所有模块产生的物品记录

export class InventoryModule  {
  name = 'inventory'
  constructor () {
    this.items = []
    this.keywords = {

    }
    this.proposals = {}
    this.blueprints = []
  }

  get () {
    return this.status
  }

  init (payload) {

  }

  dispatch (modules, action) {
  }
}
