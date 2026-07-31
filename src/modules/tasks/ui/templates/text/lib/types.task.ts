import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'text'` tasks.
 *
 * Covers every structural group (`text_1` … `text_81`): groups differ mostly
 * by `fields` keys, which do not affect the template — interpolation happens
 * inside `TaskDescription` via `applyTaskFields`.
 *
 * The `answerInput` shape is what selects the concrete template,
 * see `classify-text-template.ts`.
 *
 * Example payloads: `data/task.json` in each template folder.
 */
export interface TextTaskDescription {
  type: 'text'
  with_audio: boolean
  content: Translation | string
}

/** Single input (`answerInput.type: 10`) with optional adornments. */
export interface SimpleTextAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

/** Several inputs: `input1..inputN`, optionally rendered in one row (`inline`). */
export interface MultiTextAnswerInput {
  type: number
  inline?: boolean
  [key: `input${number}`]: SimpleTextAnswerInput | undefined
}

/**
 * Rare case: the whole `answerInput` is a Translation (a unit label
 * such as «руб»), not a type-10 object.
 */
export type TextAnswerInput =
  | SimpleTextAnswerInput
  | MultiTextAnswerInput
  | Translation

export interface TextTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_1_1`. */
  type: string
  title: Translation | string | null
  description: TextTaskDescription
  fields?: Record<string, unknown>
  answerInput?: TextAnswerInput
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
  /** Filled client-side / after solution request. */
  answer?: string | null
  /** Обычно `TextTaskSolution` из `./types.solution.ts`. */
  solution?: TaskSolution | string | null
}
