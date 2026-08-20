/**
 * API payloads use snake_case; Matheducator / our figure components use camelCase.
 * Translation objects must stay untouched (`module_name` is the type guard).
 */

import { isTranslationObject } from '@/modules/tasks/lib/solution-types'

const SNAKE_TO_CAMEL: Record<string, string> = {
  repeat_quantity: 'repeatQuantity',
  background_image: 'backgroundImage',
  is_wrap_content: 'isWrapContent',
  is_vertical: 'isVertical',
  manually_set_size: 'manuallySetSize',
  with_number: 'withNumber',
  not_clickable_dots: 'notClickableDots',
  show_axis: 'showAxis',
  show_cells: 'showCells',
  start_number: 'startNumber',
  reduce_height: 'reduceHeight',
  tick_step: 'tickStep',
  tick_step_x_multiply: 'tickStepXMultiply',
  tick_step_y_multiply: 'tickStepYMultiply',
  step_size: 'stepSize',
  min_position: 'minPosition',
  max_position: 'maxPosition',
  x_axis_label: 'xAxisLabel',
  y_axis_label: 'yAxisLabel',
  is_line: 'isLine',
  is_full_filled: 'isFullFilled',
  is_filling_limited_by_axis: 'isFillingLimitedByAxis',
  limited_point: 'limitedPoint',
  filling_functions: 'fillingFunctions',
  allowed_figures: 'allowedFigures',
  can_draw_multiple_figures: 'canDrawMultipleFigures',
  can_fill: 'canFill',
  disabled_points: 'disabledPoints',
  displayed_numbers: 'displayedNumbers',
  drawing_figure: 'drawingFigure',
  show_protractor: 'showProtractor',
  show_overall_angle: 'showOverallAngle',
  center_point_letter: 'centerPointLetter',
  divisions_is_visible: 'divisionsIsVisible',
}

const toCamelKey = (key: string): string => {
  if (SNAKE_TO_CAMEL[key]) return SNAKE_TO_CAMEL[key]
  if (!key.includes('_')) return key
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
}

const normalizeValue = (value: unknown): unknown => {
  // Must run before object/array walks — otherwise `module_name` becomes `moduleName`.
  if (isTranslationObject(value)) {
    return value
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item))
  }
  if (value && typeof value === 'object') {
    return normalizeComplexPart(value as Record<string, unknown>)
  }
  return value
}

/** Deep-normalize a complex description part (and nested objects/arrays). */
export const normalizeComplexPart = <T extends Record<string, unknown>>(
  part: T,
): T => {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(part)) {
    out[toCamelKey(key)] = normalizeValue(value)
  }
  return out as T
}
