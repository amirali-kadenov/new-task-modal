import { stripMathDelimiters } from './strip-math-delimiters'

/**
 * Собирает значения `input1..N` в строку для `SolutionAnswerPanel`.
 * Панель рендерит правильный ответ через `MathText`, который не добавляет
 * делимитеры, поэтому каждое значение оборачиваем сами.
 */
export const joinMathAnswers = (values: string[]): string =>
  values
    .map((value) => stripMathDelimiters(value))
    .filter(Boolean)
    .map((value) => `\\(${value}\\)`)
    .join(' ; ')
