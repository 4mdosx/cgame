import { getGameStatus } from '@/game/interface/index.js'
import { materials } from '../schema/material'

export class InventoryModule  {
  name = 'inventory'
  constructor () {
    this.items = {}
    this.proposals = []
  }

  dispatch (action) {
    switch (action.type) {
      case 'character/gathering':
        const { itemName } = action
        if (!this.items[itemName]) this.items[itemName] = 0
        if (this.items[itemName] > getGameStatus('MAX_STORAGE/' + itemName)) return
        this.items[action.itemName] += action.quantity
        break
      case 'inventory/proposal/add': {
        const { proposal } = action
        this.consume('ora', proposal)
        this.proposals = this.proposals.filter(p => p.id !== proposal.id)
        if (this.proposals.length === 3) {
          this.proposals.pop()
        }
        this.proposals.unshift(proposal)
        break
      }
      case 'inventory/proposal/accept': {
        const { proposalId } = action
        const proposal = this.proposals.find(proposal => proposal.id === proposalId)
        if (!proposal) return
        this.context.dispatch({
          type: 'task/create',
          proposal
        })
        this.dispatch({
          type: 'inventory/proposal/remove',
          proposalId
        })
        break
      }
      case 'inventory/proposal/remove':
        this.proposals = this.proposals.filter(proposal => proposal.id !== action.proposalId)
        break
      case 'tick':
        break
      default:
    }
  }

  match (keyword) {
    return Object.entries(this.items).map(([key, val]) => {
      if (val < 1) return false
      const material = materials[key]
      if (!material) return false
      if(material.keywords.includes(keyword)) return [key, material]
      return false
    }).filter(Boolean)
  }

  consume (itemName, quantity) {
    if (!this.items[itemName]) return false
    if (this.items[itemName] < quantity) return false
    this.items[itemName] -= quantity
    return true
  }

  take (itemName, quantity) {
    if (!this.items[itemName]) return 0
    if (this.items[itemName] < quantity) {
      const count = this.items[itemName]
      this.items[itemName] = 0
      return count
    }
    this.items[itemName] -= quantity
    return quantity
  }

  valueOf () {
    return {
      items: this.items,
      proposals: [...this.proposals],
    }
  }

  init ({ inventory = {}, home}) {
    Object.assign(this, inventory)
    if (!home) {
      this.proposals.push({
        id: 'bonfire',
        type: 'building',
        schema: 'bonfire',
        extra: { free: true }
      })
    }
  }
}
