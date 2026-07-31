import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'formula'` tasks.
 *
 * Content is a short inline math expression (e.g. `10000 + 3 = `), rendered
 * beside the `MathInput` (unlike text/columnOperation, which stack description
 * above input) — see old `formula.tsx`.
 *
 * Example payloads: `data/task.json` in each template folder.
 */
export interface FormulaTaskDescription {
  type: 'formula'
  content: Translation | string
  direction?: string
}

/** Single input (`answerInput.type: 10`) with optional adornments. */
export interface SimpleFormulaAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

/** Several inputs: `input1..inputN` (`inline` false → stack layout). */
export interface MultiFormulaAnswerInput {
  type: number
  inline?: boolean
  [key: `input${number}`]: SimpleFormulaAnswerInput | undefined
}

export type FormulaAnswerInput =
  | SimpleFormulaAnswerInput
  | MultiFormulaAnswerInput

export interface FormulaTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_1_14`. */
  type: string
  title: Translation | string | null
  description: FormulaTaskDescription
  fields?: Record<string, unknown>
  answerInput?: FormulaAnswerInput
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
