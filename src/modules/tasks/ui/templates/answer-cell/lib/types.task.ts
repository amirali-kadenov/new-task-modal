import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'answerCell'` tasks.
 *
 * Content embeds `answercell` tokens interleaved with MathInputs (ME model).
 * The `answerInput` shape selects the template id.
 */

export interface AnswerCellTaskDescription {
  type: 'answerCell'
  content: Translation | string
  textBefore?: Translation | string | null
  textAfter?: Translation | string | null
  imageBefore?: string | null
  tableBefore?: unknown | null
  isColumn?: boolean
  answerCellMargin?: string | null
  withAudio?: boolean
}

export interface SimpleAnswerCellAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

export interface MultiAnswerCellAnswerInput {
  type?: number
  inline?: boolean
  [key: `input${number}`]: SimpleAnswerCellAnswerInput | undefined
}

export type AnswerCellAnswerInput =
  | SimpleAnswerCellAnswerInput
  | MultiAnswerCellAnswerInput

export interface AnswerCellTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_1_66`. */
  type: string
  title: Translation | string | null
  description: AnswerCellTaskDescription
  fields?: Record<string, unknown>
  answerInput?: AnswerCellAnswerInput
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
