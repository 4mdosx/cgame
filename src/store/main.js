import { create } from 'zustand'
import { createHomeSlice } from './home'

export const useStore = create((set, get) => ({
  theme: 'adr',
  proposals: [],
  items: [],
  buildings: [],
  ...createHomeSlice(set, get),
  mapGameStatusToStore: (modules) => {
    const { inventory, home } = modules
    const { items, proposals } = inventory.get()
    const { buildings, overview } = home.get()
    set({
      items,
      proposals,
      buildings,
      overview
    })
  }
}))
