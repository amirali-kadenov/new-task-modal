import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'test'` tasks.
 *
 * Variants are Translations (labels). Answer is letter A/B/C… matching index.
 */

export interface TestTaskDescription {
  type: 'test'
  question: Translation | string
  variants: Translation[]
  questionAfter?: Translation | string | null
  correctAnswer?: string | null
  isHorizontal?: boolean
  isWrapVariants?: boolean
  showLetters?: boolean
  hasMultipleAnswers?: boolean
  variantsWithoutLabels?: boolean
  variantsWidth?: number
  variantsCenter?: boolean
  withAudio?: boolean
  withAudioOnVariants?: boolean
  questionFontSize?: number
  questionAlign?: string
  figures?: Array<{ type: number; [key: string]: unknown }>
  images?: string[] | null
  background?: string | null
  table?: unknown
  isChooseButtonsHidden?: boolean
  isFiguresVertical?: boolean
  toLeftFigures?: boolean
  leftPositionFigures?: number
  maxWidth?: string
  maxItemsPerRow?: number
  horizontalFontSize?: number
  audioQuestion?: string | null
  alignFromBottom?: boolean
  countable?: unknown[]
}

export interface SimpleTestAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

export type TestAnswerInput = SimpleTestAnswerInput

export interface TestTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_1_2`. */
  type: string
  title: Translation | string | null
  description: TestTaskDescription
  fields?: Record<string, unknown>
  answerInput?: TestAnswerInput
  difficulty?: string | null
  result?: string
  position?: number
  attemptsCount?: number | null
  hasVideoUrl?: boolean
  videoId?: string | null
  videoUrl?: string | null
  videoUrlAsTranslation?: unknown
  locatedCountry?: string | null
  /** Always null for grade-4 fixtures: no Elixir `def hint/2` content. */
  hint1?: string | null
  hint2?: string | null
  isPenalty?: boolean
  isPrimary?: boolean
  answer?: string | null
  solution?: TaskSolution | string | null
}
