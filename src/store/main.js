import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createHomeSlice } from './home'

export const useStore = create(
  persist(
    (set, get) => ({
      theme: 'adr',
      ...createHomeSlice(set, get)
    }),
    {
      name: 'the-sunken-ancient-world',
      getStorage: () => createJSONStorage(),
    }
  )
)
