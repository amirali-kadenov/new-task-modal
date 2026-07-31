import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'columnOperation'` tasks.
 *
 * Structural groups (`columnOperation_1` … `_3`) differ by answerInput shape
 * and whether `description.content` is a string or Translation — the latter
 * does not create a new template (same as text).
 *
 * Example payloads: `data/task.json` in each template folder.
 */
export interface ColumnOperationTaskDescription {
  type: 'columnOperation'
  with_audio?: boolean
  content: Translation | string
}

/** Single input (`answerInput.type: 10`) with optional adornments. */
export interface SimpleColumnOperationAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

/** Several inputs: `input1..inputN` (`inline` false → stack layout). */
export interface MultiColumnOperationAnswerInput {
  type: number
  inline?: boolean
  [key: `input${number}`]: SimpleColumnOperationAnswerInput | undefined
}

export type ColumnOperationAnswerInput =
  | SimpleColumnOperationAnswerInput
  | MultiColumnOperationAnswerInput

export interface ColumnOperationTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_2_3`. */
  type: string
  title: Translation | string | null
  description: ColumnOperationTaskDescription
  fields?: Record<string, unknown>
  answerInput?: ColumnOperationAnswerInput
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
