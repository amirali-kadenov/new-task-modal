import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'comparison'` tasks.
 *
 * UI is `first | MathInput | second`. Sides may be number, string, or Translation.
 */

export type ComparisonSide = number | string | Translation

export interface ComparisonTaskDescription {
  type: 'comparison'
  first: ComparisonSide
  second: ComparisonSide
  textBefore?: Translation | string | null
  textAfter?: Translation | string | null
  imageBefore?: string | null
  images?: string[]
  svg1?: string | null
  svg2?: string | null
  equations?: Array<Translation | string>
  tableBefore?: unknown | null
  withAudio?: boolean
}

export interface SimpleComparisonAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

export interface MultiComparisonAnswerInput {
  type?: number
  inline?: boolean
  [key: `input${number}`]: SimpleComparisonAnswerInput | undefined
}

export type ComparisonAnswerInput =
  | SimpleComparisonAnswerInput
  | MultiComparisonAnswerInput

export interface ComparisonTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_1_13`. */
  type: string
  title: Translation | string | null
  description: ComparisonTaskDescription
  fields?: Record<string, unknown>
  answerInput?: ComparisonAnswerInput
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
