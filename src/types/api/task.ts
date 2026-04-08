import type { TaskAnswerInputType, TaskDescriptionType } from '../enums'

import type { VideoUrlAsTranslation } from './api'

export interface TaskDescription {
  type: TaskDescriptionType
  with_audio: boolean
  content: Translation
}

type TypedDescriptionsMap = {
  text: TaskDescriptionText
  test: TaskDescriptionTest
  answerCell: TaskDescriptionAnswerCell
  columnOperation: TaskDescriptionColumnOperation
  table: TaskDescriptionTable
  comparison: TaskDescriptionComparison
  equation: TaskDescriptionEquation
}

type DescriptionMap = TypedDescriptionsMap & {
  [K in Exclude<
    TaskDescriptionType,
    keyof TypedDescriptionsMap
  >]: TaskDescription
}

export interface TaskDescriptionTest {
  type: 'test'
  withAudioOnVariants: boolean
  withAudio: boolean
  variantsWithoutLabels: boolean
  variantsWidth: number
  variantsCenter: boolean
  variants: Translation[]
  toLeftFigures: boolean
  table: null
  questionFontSize: number
  questionAfter: null
  question: Translation
  maxWidth: string
  maxItemsPerRow: number
  leftPositionFigures: number
  isWrapVariants: boolean
  isHorizontal: boolean
  isFiguresVertical: boolean
  isChooseButtonsHidden: boolean
  images: null
  horizontalFontSize: number
  hasMultipleAnswers: boolean
  figures: null
  countable: unknown[]
  correctAnswer: null
  background: null
  audioQuestion: string
  alignFromBottom: boolean
}

interface TaskDescriptionText {
  type: 'text'
  with_audio: boolean
  content: Translation
}

export interface TaskDescriptionAnswerCell {
  withAudio: boolean
  type: 'answerCell'
  textBefore: Translation
  textAfter: string
  tableBefore: null
  isColumn: boolean
  imageBefore: string
  content: string // "answercell + answercell"
  answerCellMargin: string
}

export interface TaskDescriptionColumnOperation {
  type: 'columnOperation'
  content: Translation | string
}

export interface TaskDescriptionComparison {
  type: 'comparison'
  first: number | string
  second: number | string
  text_before?: string
  text_after?: string
  imageBefore?: string
  images?: string[]
}

export interface TaskDescriptionEquation {
  type: 'equation'
  content: Translation
}

export interface TableCell extends Translation {}

export interface TableRow {
  cells: (TableCell | string)[]
  colspan_list?: number[]
  rowspan_list?: number[]
  rowspan?: number
  colspan?: number
  border_bottom?: string | null
  width?: string | null
}

export interface TaskDescriptionTable {
  type: 'table'
  table: {
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
  withAudio?: boolean
  content?: string
}

export interface TaskSolution {
  answer: string
  content: Translation | string
  type: TaskDescriptionType
}

export interface Task<T extends TaskDescriptionType = 'text'> {
  id: string
  type: T
  title: string
  fields?: Record<string, unknown>
  lockVersion?: number | null
  answer?: string | null
  description: DescriptionMap[T]
  result?: string
  attemptsCount?: number
  hint1?: string
  hint2?: string
  solution?: TaskSolution | null
  videoUrl?: string
  videoId?: string
  locatedCountry?: string
  videoUrlAsTranslation?: VideoUrlAsTranslation
  hasTheory?: boolean
  isPenalty?: boolean
  position?: number
  clearSelectedIndexes?: boolean
  selectedIndexes?: number[]
  isAnswerChanged?: boolean
  answerInput?: AnswerInput
}

interface AnswerInputItem {
  before: string | Translation
  svg: string
  after: string | Translation
  text: string
  down: string
  up: string
  type: TaskAnswerInputType
}

interface AnswerInput extends Partial<AnswerInputItem> {
  inline: boolean
  [key: `input${number}`]: AnswerInputItem | undefined
  type: TaskAnswerInputType
}

export interface Translation {
  with_audio_player: boolean
  aze: string
  arsa: string
  areg: string
  kgz: string
  uzb: string
  eng: string
  rus: string
  kaz: string
  school: string
  module_name: 'Elixir.Helpers.Translation'
}
