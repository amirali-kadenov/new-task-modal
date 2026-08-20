import { splitMultiAnswer } from '@/modules/tasks/lib/multi-answer'

import type { TaskModalDependencies } from './types/props'

export const FOCUSED = 'focused'
export const DATA_INPUT = 'data-input'
export const DATA_CALC = 'data-calc'

export const getParentWithAttr = (element: HTMLElement, attr: string) => {
  let parent = element.parentElement
  while (parent) {
    if (parent.hasAttribute(attr)) return parent
    parent = parent.parentElement
  }
  return null
}

export const isAnswerEmpty = (answer: string, deps: TaskModalDependencies) => {
  return splitMultiAnswer(
    answer,
    deps.helpers.TaskHelper.multipleTaskAnswerSeparator,
  ).some((it) => it === '')
}
