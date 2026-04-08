import { create } from 'zustand'

import type { AiChatMessageType } from './types'

interface AiChatState {
  messages: AiChatMessageType[]
  isHintShown: boolean
  isSolutionShown: boolean
  isTheoryShown: boolean
  taskId: string | null
}

interface AiChatActions {
  setMessages: (
    messages:
      | AiChatMessageType[]
      | ((prev: AiChatMessageType[]) => AiChatMessageType[]),
  ) => void
  addMessages: (...messages: AiChatMessageType[]) => void
  setIsHintShown: (isHintShown: boolean) => void
  setIsSolutionShown: (isSolutionShown: boolean) => void
  setIsTheoryShown: (isTheoryShown: boolean) => void
  setTaskId: (taskId: string) => void
  reset: (taskId: string) => void
}

export type AiChatStore = AiChatState & AiChatActions

export const useAiChatStore = create<AiChatStore>((set) => ({
  messages: [],
  isHintShown: false,
  isSolutionShown: false,
  isTheoryShown: false,
  taskId: null,

  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === 'function' ? messages(state.messages) : messages,
    })),

  addMessages: (...newMessages) =>
    set((state) => ({
      messages: [...state.messages, ...newMessages],
    })),

  setIsHintShown: (isHintShown) => set({ isHintShown }),
  setIsSolutionShown: (isSolutionShown) => set({ isSolutionShown }),
  setIsTheoryShown: (isTheoryShown) => set({ isTheoryShown }),
  setTaskId: (taskId) => set({ taskId }),
  reset: (taskId) =>
    set({
      messages: [],
      isHintShown: false,
      isSolutionShown: false,
      isTheoryShown: false,
      taskId,
    }),
}))
