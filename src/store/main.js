import { create } from 'zustand'
// import { createHomeSlice } from './home'

export const useStore = create((set, get) => ({
  theme: 'adr',
  proposals: [],
  items: [],
  buildings: [],
  overview: {},
  mapGameStatusToStore: (modules) => {
    const { inventory, home, system } = modules
    const { items, proposals } = inventory.valueOf()
    const { buildings } = home.valueOf()

    set({
      items: Object.entries(items),
      proposals,
      buildings,
      overview: {
        store: system.store,
        building_effect: system.building_effect,
      }
    })
  }
}))
