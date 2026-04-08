import { create } from 'zustand'

import type { TaskModalState } from '../types/props'

interface State {
  // task loading
  isTaskLoaded: boolean
  setIsTaskLoaded: (isLoading: boolean) => void

  // answer
  answer: string
  setAnswer: (answer: string) => void

  // prev answer
  prevAnswer: string | null
  setPrevAnswer: (answer: string | null) => void

  // state
  state: TaskModalState | null
  setState: (state: Partial<TaskModalState>) => void

  // available tasks
  availableTasks: Record<string, boolean> | null
  setAvailableTasks: (availableTasks: Record<string, boolean>) => void

  // is answer changed
  isAnswerChanged: boolean
  setIsAnswerChanged: (isAnswerChanged: boolean) => void

  isTransitioning: boolean
  setIsTransitioning: (isTransitioning: boolean) => void
}

export const useStore = create<State>((set) => ({
  // task loading
  isTaskLoaded: false,
  setIsTaskLoaded: (isTaskLoaded: boolean) => {
    // console.log('SET IS TASK LOADED', isTaskLoaded)
    set({
      isTaskLoaded,
    })
  },

  // answer
  answer: '',
  setAnswer: (answer) => set({ answer }),

  // prev answer
  prevAnswer: null,
  setPrevAnswer: (prevAnswer) => set({ prevAnswer }),

  // app state
  state: null,
  setState: (state) => {
    // console.log('SET STATE', state)
    set((prev) => ({
      state: { ...prev.state, ...(state as TaskModalState) },
    }))
  },

  // available tasks
  availableTasks: null,
  setAvailableTasks: (availableTasks) =>
    set({
      availableTasks,
    }),

  // is answer changed
  isAnswerChanged: false,
  setIsAnswerChanged: (isAnswerChanged) =>
    set({
      isAnswerChanged,
    }),

  // is transitioning
  isTransitioning: false,
  setIsTransitioning: (isTransitioning) =>
    set({
      isTransitioning,
    }),
}))

export const useAppState = () => {
  const state = useStore((s) => s.state)
  if (!state) throw new Error('state must be set')

  return state
}

export const getAppState = () => {
  const state = useStore.getState().state
  if (!state) throw new Error('state must be set')

  return state
}

export const useSetAppState = () => {
  return useStore((s) => s.setState)
}
