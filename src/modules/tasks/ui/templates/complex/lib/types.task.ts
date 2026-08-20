import type { TaskSolution, Translation } from '@/types/api/task'

/**
 * Backend payload for `description.type === 'complex'` tasks.
 *
 * Description is a list of figure parts (text / image / coordinate plane / …),
 * not a single `content` string. The `answerInput` shape selects the template.
 */

export interface ComplexTextPart {
  type: 10
  content: Translation | string
}

export interface ComplexImagePart {
  type: 160
  content: Translation | string | string[]
  repeatQuantity?: number
  countable?: boolean
  isWrapContent?: boolean
  isVertical?: boolean
  manuallySetSize?: boolean | number
  withNumber?: number | string | boolean
  backgroundImage?: string | null
  size?: number
}

export interface ComplexNumberLinePart {
  type: 20
  tickStep?: number
  stepSize?: number
  minPosition?: number
  maxPosition?: number
  divisionsIsVisible?: boolean
  numbers?: Array<{ position: number }>
  letters?: Array<{ position: number; letter?: string }>
  dots?: Array<{ position: number; letter?: string; withNumber?: boolean }>
}

export interface ComplexAngleListPart {
  type: 50
  showProtractor?: boolean
  showOverallAngle?: boolean
  centerPointLetter?: string
  list?: Array<{
    text?: string
    isTextVisible?: boolean
    isCurveVisible?: boolean
    degree?: number
    dot?: { letter?: string } | null
  }>
}

export interface ComplexCoordinatePlanePart {
  type: 110
  xAxisLabel?: string
  yAxisLabel?: string
  tickStep?: number
  tickStepXMultiply?: number
  tickStepYMultiply?: number
  stepSize?: number
  minPosition?: number
  maxPosition?: number
  showAxis?: boolean
  showCells?: boolean
  startNumber?: boolean
  reduceHeight?: number
  notClickableDots?: boolean
  isLine?: boolean
  isFullFilled?: boolean
  isFillingLimitedByAxis?: boolean
  limitedPoint?: number
  points?: unknown[]
  figures?: unknown[]
  intervals?: unknown[]
  fillingFunctions?: unknown[]
  [key: string]: unknown
}

export interface ComplexTableRow {
  cells: unknown[]
  colspan_list?: number[]
  rowspan_list?: number[]
  border_bottom?: string
}

export interface ComplexTablePart {
  type: 120
  rows?: ComplexTableRow[]
  width?: string
  tableAlign?: string
  removeBorders?: boolean
  removePadding?: boolean
  padding?: string
  marginBottom?: string
  border?: string
  columnHeaders?: Array<{ name?: unknown }>
  [key: string]: unknown
}

export type ComplexPart =
  | ComplexTextPart
  | ComplexImagePart
  | ComplexNumberLinePart
  | ComplexAngleListPart
  | ComplexCoordinatePlanePart
  | ComplexTablePart
  | { type: number; [key: string]: unknown }

export interface ComplexTaskDescription {
  type: 'complex'
  parts: ComplexPart[]
  isAnswerCellHidden?: boolean
  isCalculatorClosed?: boolean
}

export interface SimpleComplexAnswerInput {
  type: number
  before: string | Translation
  after: string | Translation
  text: string
  down: string
  up: string
  svg: string
}

export interface MultiComplexAnswerInput {
  type: number
  inline?: boolean
  [key: `input${number}`]: SimpleComplexAnswerInput | undefined
}

export type ComplexAnswerInput =
  | SimpleComplexAnswerInput
  | MultiComplexAnswerInput

export interface ComplexTask {
  id: string
  /** Elixir module id, e.g. `Elixir.Task_4_6_6_1`. */
  type: string
  title: Translation | string | null
  description: ComplexTaskDescription
  fields?: Record<string, unknown>
  answerInput?: ComplexAnswerInput
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
