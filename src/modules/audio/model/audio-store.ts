import { create } from 'zustand'

interface State {
  progress: number
  setProgress: (progress: number) => void
}

export const useAudioStore = create<State>((set) => ({
  progress: 0,
  setProgress: (progress: number) => set({ progress }),
}))
