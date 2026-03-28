import { create } from 'zustand'

// Zones ordered left→right. Index maps to CSS translateX.
// Hero=1 is the visible default (world starts at -100vw offset so Hero is centered)
export const ZONES = ['projects', 'hero', 'experience']
export const ZONE_INDEX = { projects: 0, hero: 1, experience: 2 }

// transitionPhase: 'idle' | 'walking' | 'entering-cave' | 'dark' | 'emerging' | 'arriving'
const useForestStore = create((set, get) => ({
  activeZone: 'hero',
  targetZone: null,
  transitionPhase: 'idle',
  oriX: 0,           // Ori's X position within current viewport (0 = center)
  oriDirection: 1,   // 1 = facing right, -1 = facing left
  oriState: 'idle',  // 'idle' | 'walk' | 'enter-cave' | 'emerge'

  setOriState: (oriState) => set({ oriState }),
  setOriX: (oriX) => set({ oriX }),
  setOriDirection: (oriDirection) => set({ oriDirection }),

  startTransition: (targetZone) => {
    if (get().transitionPhase !== 'idle') return
    set({ targetZone, transitionPhase: 'walking' })
  },

  setTransitionPhase: (transitionPhase) => set({ transitionPhase }),

  completeTransition: () => {
    const { targetZone } = get()
    set({
      activeZone: targetZone,
      targetZone: null,
      transitionPhase: 'idle',
      oriX: 0,
      oriState: 'idle',
    })
  },
}))

export default useForestStore
