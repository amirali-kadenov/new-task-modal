import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'equation'` tasks.
 *
 * Grade 4: `content` is the equation (Translation); answer is `x = …`
 * via `answerInput.before` + MathInput.
 */

export interface EquationTaskDescription {
  type: 'equation'
  content: Translation | string
  with_audio?: boolean
}

export interface SimpleEquationAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

export type EquationAnswerInput = SimpleEquationAnswerInput

export interface EquationTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_3_6_1`. */
  type: string
  title: Translation | string | null
  description: EquationTaskDescription
  fields?: Record<string, unknown>
  answerInput?: EquationAnswerInput
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
