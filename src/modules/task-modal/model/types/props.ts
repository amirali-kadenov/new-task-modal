import type { Api, Lesson, Theory, User } from '@/types/api/api'
import type { Task } from '@/types/api/task'
import type { Enums } from '@/types/enums'
import type { Global } from '@/types/global'
import type { Localize } from '@/types/localize'

import type { TaskModalActions } from './actions'
import type { Socket, SocketController } from './socket'

export interface TaskModalProps {
  activeTask: Task
  deps: TaskModalDependencies
  state: TaskModalState
  setState: SetTaskModalState
  hostProps: TaskModalHostProps
  actions: TaskModalActions
  closeModal: () => void
  renderLegacyTask?: RenderLegacyTask
}

export interface TaskModalDependencies {
  api: Api
  global: Global
  localize: Localize
  lodash: typeof import('lodash')
  enums: Enums
  toast: typeof import('react-toastify').toast
  socketController: SocketController
  socket: Socket
  cookies: typeof import('js-cookie')
  helpers: TaskModalHelpers
  eventEmitter: EventEmitter
  alert: Alert
  featureFlags?: {
    useMentorChatMediaApi?: boolean
  }
}

export type RenderLegacyTask = (
  container: HTMLElement,
  activeTask: Task,
  callbacks: {
    onTaskAnswerChanged: (answer: unknown) => void
    onTaskDescriptionChanged?: (desc: unknown) => void
  },
) => void | (() => void)

interface Alert {
  showError: (error: unknown) => void
  showSuccessMessage: (message: string) => void
  showInfoMessage: (message: string, timeout?: number) => void
  showWarningMessage: (message: string, timeout?: number) => void
  showErrorMessage: (message: string) => void
}

interface EventEmitter {
  emit: (event: string, ...args: unknown[]) => boolean
  on: (event: string, listener: (...args: unknown[]) => void) => unknown
  off: (event: string, listener: (...args: unknown[]) => void) => unknown
}

export interface TaskModalHelpers {
  CyrillicTo: {
    default_numeral: (text: string) => string
  }
  TaskHelper: {
    multipleTaskAnswerSeparator: string
    isMultipleAnswerInputType: (answerInput: unknown) => boolean
    getAnswerInputsQuantity: (answerInput: unknown) => number
    convertToArabicNumeral: (number: number) => string
  }
  ArabicNumeralUtils: {
    isArabic(): boolean
    getDirection(): string
  }
}

type TaskModalStateSetter = (state: TaskModalState) => void

export type SetTaskModalState = (
  arg: Partial<TaskModalState> | TaskModalStateSetter,
) => void

export interface TaskModalState {
  activeTask: Task
  isLoading: boolean
  tasks: Task[] | null
  isOurPupil: boolean | null
  isStartedToday: boolean | null
  timeLeft: number | null
  hasTheory: boolean | null
  currentUser: User
  selectedIndexes: number[]
  lockVersion: number | null
  characterTexts: CharacterTexts
  selectedCharacter: string | null
  lesson: Lesson | null
  isTheoryHide: boolean
  userProgress: number
  isReloadPageConfirmationOpen: boolean
  isTimeElapsedModalOpen: boolean
  errorMessage?: string
  correctTextIndex: number
  incorrecTextIndex: number
  lockVersionConflict: boolean
  initialTasksCount: number
  checkUserAnswerResult: number
  isShowingSolution: boolean
  isShowingVideoExplanation: boolean
  isVideoButtonClicked: boolean
  isSaving: boolean
  selectedTheory: Theory | null
  locatedCountry: string | null
}

interface CharacterTexts {
  yourAnswerIsCorrect: string[]
  yourAnswerIsNotCorrect: string[]
}

export interface TaskModalHostProps {
  lessonId?: number
  personalStudyItemId?: number
  teacherLessonId?: number
  selfWorkId?: number
  userProgress: number
  isNewFreeTasks?: boolean
  fontSizeFactor: number
  socket: unknown
  isMobile?: string
  appVersion?: string
  updateAsCompleted?: () => void
  applicationType?: string
  canUseDotNavigation?: boolean
  isTesting?: boolean

  // router props
  location: Location
  history: History
}

export interface Location {
  pathname: string // e.g., "/products/123"
  search: string // e.g., "?sort=desc"
  hash: string // e.g., "#details"
  key: string // Unique ID for this entry in history
}

export interface History {
  length: number
  action: 'PUSH' | 'REPLACE' | 'POP'
  location: {
    pathname: string
    search: string
    hash: string
    state: unknown
    key?: string
  }
  push(path: string, state?: unknown): void
  replace(path: string | ReplaceObject, state?: unknown): void
  go(n: number): void
  goBack(): void
  goForward(): void
  block(prompt?: string | boolean): () => void
  listen(listener: (location: unknown, action: unknown) => void): () => void
  createHref(location: unknown): string
}

interface ReplaceObject {
  search: string
}
