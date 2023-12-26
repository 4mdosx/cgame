import { create } from 'zustand'
import { createHomeSlice } from './home'

export const useStore = create((set, get) => ({
  theme: 'adr',
  proposals: [],
  items: [],
  buildings: [],
  overview: {},
  ...createHomeSlice(set, get),
  mapGameStatusToStore: (modules) => {
    const { inventory, home, system } = modules
    const { items, proposals } = inventory.get()
    const { buildings } = home.get()

    set({
      items,
      proposals,
      buildings,
      overview: {
        store: system.store,
        building_effect: system.building_effect,
      }
    })
  }
}))
