import { create } from 'zustand'
import Lenis from 'lenis'

interface ScrollStore {
  lenis: Lenis | undefined
  setLenis: (lenis: Lenis | undefined) => void
}

export const useScrollStore = create<ScrollStore>((set) => ({
  lenis: undefined,
  setLenis: (lenis) => set({ lenis }),
}))
