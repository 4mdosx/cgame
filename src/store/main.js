import { create } from 'zustand'
import { createHomeSlice } from './home'

export const useStore = create((set, get) => ({
  theme: 'adr',
  proposals: [],
  items: [],
  ...createHomeSlice(set, get),
  mapGameStatusToStore: (modules) => {
    const { inventory } = modules
    const { items, proposals } = inventory.get()
    set({
      items,
      proposals,
      overview: modules.home.get().overview,
    })
  }
}))
