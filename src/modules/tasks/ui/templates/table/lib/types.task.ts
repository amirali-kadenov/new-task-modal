import type {
  TableRow,
  TaskSolution,
  Translation,
} from '@/types/api/task'

/**
 * Backend payload for `description.type === 'table'` tasks.
 *
 * Structural groups (`table_1` … `table_7`) differ by fields, optional title,
 * and `content` string vs Translation — they share one UI template.
 *
 * Example payloads: `data/task.json` in each template folder.
 */
export interface TableTaskDescription {
  type: 'table'
  withAudio?: boolean
  content?: Translation | string
  table?: {
    rows: TableRow[]
    width?: string
    type?: number
    tableAlign?: string
    removePadding?: boolean
    removeBorders?: boolean
    padding?: string | null
    marginBottom?: string | null
    isAnswerCellHidden?: boolean
    columnHeaders?: unknown[]
    columnAlign?: string
    bottomVarticalAlign?: boolean
    border?: string
  }
  isTableReversed?: boolean
  isTableFlip?: boolean
  isCentered?: boolean
  answerCellWithComparison?: boolean
  isAnswerCellHidden?: boolean
  imageBefore?: string
  isCalculatorClosed?: boolean
}

/** Plain multi-cell answerInput (`type: 15`, empty adornments). */
export interface TableAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

export interface TableTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_3_5_1`. */
  type: string
  title: Translation | string | null
  description: TableTaskDescription
  fields?: Record<string, unknown>
  answerInput?: TableAnswerInput
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
